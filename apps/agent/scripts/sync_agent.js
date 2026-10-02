#!/usr/bin/env node

/**
 * CX Agent Studio Sync & Deployment Script
 * Deploys agent specification and tools to Customer Engagement Suite (CES) on GCP
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'sa-training-466722';
const LOCATION = process.env.GCP_LOCATION || 'us';
const APP_ID = process.env.CXAS_APP_ID || '82a19631-fe39-40fa-a593-60778d958407';

const agentYamlPath = path.join(__dirname, '../spec/agent.yaml');
const agentConfig = yaml.parse(fs.readFileSync(agentYamlPath, 'utf8'));

console.log('=== [CXAS] Synchronizing Agent Specification with Google Cloud ===');
console.log(`Project:  ${PROJECT_ID}`);
console.log(`Location: ${LOCATION}`);
console.log(`App ID:   ${APP_ID}\n`);

// 1. Get gcloud access token
let token = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
if (!token) {
  try {
    token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  } catch (err) {
    console.error('[ERROR] Could not obtain gcloud access token. Please run `gcloud auth login`.');
    process.exit(1);
  }
}

// 2. Fetch existing app details to get rootAgent
const appUrl = `https://ces.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}`;

async function sync() {
  console.log(`Fetching application configuration from ${appUrl}...`);
  const appRes = await fetch(appUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!appRes.ok) {
    const text = await appRes.text();
    console.error(`[ERROR] Failed to fetch app: ${appRes.status} ${text}`);
    process.exit(1);
  }

  const appData = await appRes.json();
  const rootAgentName = appData.rootAgent;
  console.log(`Found root agent: ${rootAgentName}`);

  // Fetch current root agent
  const agentRes = await fetch(`https://ces.googleapis.com/v1/${rootAgentName}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!agentRes.ok) {
    console.error(`[ERROR] Failed to fetch root agent: ${agentRes.status}`);
    process.exit(1);
  }

  const currentAgent = await agentRes.json();

  // 3. Ensure OpenAPI Toolset exists
  const toolsetsUrl = `https://ces.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/toolsets`;
  console.log(`Checking existing toolsets at ${toolsetsUrl}...`);
  const toolsetsRes = await fetch(toolsetsUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const existingToolsets = await toolsetsRes.json();
  let dscToolset = existingToolsets.toolsets?.find(t => t.displayName === 'Dollar Shave Club API');

  const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://cxas-dsc-api-z66d5k5ioa-uc.a.run.app';
  console.log(`Fetching OpenAPI spec from backend: ${BACKEND_API_URL}/api/openapi.json...`);
  const specRes = await fetch(`${BACKEND_API_URL}/api/openapi.json`);
  const openApiSpec = await specRes.json();
  openApiSpec.servers = [{ url: BACKEND_API_URL }];
  const specString = JSON.stringify(openApiSpec);

  if (!dscToolset) {
    console.log(`Creating OpenAPI Toolset for Dollar Shave Club API...`);
    const createToolsetRes = await fetch(toolsetsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: 'Dollar Shave Club API',
        openApiToolset: {
          openApiSchema: specString
        }
      })
    });
    if (!createToolsetRes.ok) {
      console.warn(`[WARN] Could not create toolset: ${createToolsetRes.status} ${await createToolsetRes.text()}`);
    } else {
      dscToolset = await createToolsetRes.json();
      console.log(`[SUCCESS] Created toolset: ${dscToolset.name}`);
    }
  } else {
    console.log(`Updating existing OpenAPI Toolset: ${dscToolset.name}...`);
    const patchToolsetRes = await fetch(`https://ces.googleapis.com/v1/${dscToolset.name}?updateMask=openApiToolset.openApiSchema`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        openApiToolset: {
          openApiSchema: specString
        },
        etag: dscToolset.etag
      })
    });
    if (patchToolsetRes.ok) {
      dscToolset = await patchToolsetRes.json();
      console.log(`[SUCCESS] Updated OpenAPI Toolset schema.`);
    }
  }

  // 4. Construct prompt XML from agent.yaml
  const workflowsXml = agentConfig.root_agent.workflows.map(wf => `    <workflow name="${wf.name}">
      <trigger>${wf.trigger}</trigger>
      <instructions>
${wf.instructions.trim().split('\n').map(l => '        ' + l).join('\n')}
      </instructions>
    </workflow>`).join('\n\n');

  const guardrailsXml = agentConfig.root_agent.guardrails.map(g => `    <rule>${g}</rule>`).join('\n');

  const compiledPrompt = `<agent_prompt>
  <persona>
    <role>${agentConfig.root_agent.persona.role}</role>
    <tone>${agentConfig.root_agent.persona.tone}</tone>
    <context>You are the official Customer Experience Virtual Agent for Dollar Shave Club. You assist members with order tracking, Starter Set & Restock Box scheduling, lost shipment replacements, address updates, and secure payment updates.</context>
  </persona>

  <tool_guidelines>
    <rule>MANDATORY: Always call tool \`trackOrder\` whenever a customer provides an order number (e.g. DSC-8832, DSC-9104, DSC-7721) or email address (e.g. alex@example.com, jamie@example.com, chris@example.com) to retrieve live tracking, delivery ETA, carrier, and subscription Restock Box schedule from the backend system. Never guess or hallucinate order details.</rule>
    <rule>MANDATORY: Always call tool \`updateShippingAddress\` when a customer provides an updated shipping address.</rule>
    <rule>MANDATORY: Always call tool \`createReplacementOrder\` to ship a free replacement for lost or damaged goods once damage is validated.</rule>
    <rule>MANDATORY: Always call tool \`delayRestockBox\` when a customer asks to delay or push their next Restock Box billing date.</rule>
    <rule>MANDATORY: Always call tool \`updateSubscriptionCadence\` when a customer requests to change how often they receive restock boxes or during cancellation retention.</rule>
    <rule>MULTIMODAL VISION: You possess native Gemini multimodal vision capabilities. When a customer uploads or shares an image/photo in chat, inspect the image directly using your native vision. Verbally identify the product and describe the physical damage you observe before calling createReplacementOrder.</rule>
    <rule>MANDATORY: Always call tool \`sendSecurePaymentLink\` when payment updates are needed.</rule>
  </tool_guidelines>

  <core_workflows>
${workflowsXml}
  </core_workflows>

  <guardrails>
${guardrailsXml}
  </guardrails>
</agent_prompt>`;

  console.log(`Updating root agent with latest compiled instructions, workflows, and toolsets...`);

  const updateFields = ['instruction'];
  const patchPayload = {
    instruction: compiledPrompt,
    etag: currentAgent.etag
  };

  if (dscToolset?.name) {
    updateFields.push('toolsets');
    patchPayload.toolsets = [{
      toolset: dscToolset.name,
      toolIds: [
        'trackOrder',
        'updateShippingAddress',
        'createReplacementOrder',
        'delayRestockBox',
        'updateSubscriptionCadence',
        'validateDamagedProductImage',
        'sendSecurePaymentLink'
      ]
    }];
  }

  const patchUrl = `https://ces.googleapis.com/v1/${rootAgentName}?updateMask=${updateFields.join(',')}`;
  const patchRes = await fetch(patchUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patchPayload)
  });

  if (!patchRes.ok) {
    const errText = await patchRes.text();
    console.error(`[ERROR] Failed to patch root agent: ${patchRes.status} ${errText}`);
    process.exit(1);
  }

  console.log(`[SUCCESS] Root agent successfully updated and synchronized with CX Agent Studio!`);

  // 4. Create a new version snapshot
  console.log(`Creating version snapshot for deployment...`);
  const versionUrl = `https://ces.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/versions`;
  const versionRes = await fetch(versionUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      displayName: `dsc-sync-${Date.now().toString(36)}`,
      description: 'Synchronized from git monorepo specs'
    })
  });

  if (versionRes.ok) {
    const versionData = await versionRes.json();
    console.log(`Created version: ${versionData.name}`);

    // 5. Update webchat deployment
    const DEPLOYMENT_ID = process.env.CXAS_DEPLOYMENT_ID || '93ef4da3-d0a5-4db9-b686-cb0f5a2537fb';
    const deployUrl = `https://ces.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/deployments/${DEPLOYMENT_ID}?updateMask=appVersion`;
    const deployRes = await fetch(deployUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appVersion: versionData.name
      })
    });

    if (deployRes.ok) {
      console.log(`[SUCCESS] Deployment ${DEPLOYMENT_ID} updated to point to latest version!`);
    } else {
      console.warn(`[WARN] Could not update deployment: ${deployRes.status}`);
    }
  }
}

sync().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});

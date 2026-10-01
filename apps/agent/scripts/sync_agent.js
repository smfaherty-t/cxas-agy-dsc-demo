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

  <core_workflows>
${workflowsXml}
  </core_workflows>

  <mock_database>
    <customer id="1">
      <name>Alex Vance</name>
      <email>alex@example.com</email>
      <order_number>DSC-8832</order_number>
      <status>In Transit</status>
      <tracking_number>1Z99999999999999</tracking_number>
      <eta>Tomorrow, by 8 PM</eta>
      <next_bill_date>October 15, 2026</next_bill_date>
      <subscription>Executive Starter Set -> Full Restock Box (Bi-monthly)</subscription>
      <notes>Starter set trial delivered 1 week ago. First full-size Restock Box ships 2 weeks later so customer never runs out of blades.</notes>
    </customer>
    <customer id="2">
      <name>Jamie Cole</name>
      <email>jamie@example.com</email>
      <order_number>DSC-9104</order_number>
      <status>Delayed / Lost in Transit</status>
      <tracking_number>9400111122223333</tracking_number>
      <last_carrier_scan>4 days ago (No movement)</last_carrier_scan>
      <current_address>456 Oak Rd, Seattle WA 98101</current_address>
      <subscription>4-Blade Club</subscription>
      <policy>Carrier scan gap > 4 days qualifies for immediate free replacement. Address can be updated before reshipment.</policy>
    </customer>
    <customer id="3">
      <name>Chris Wright</name>
      <email>chris@example.com</email>
      <order_number>DSC-7721</order_number>
      <status>Delivered</status>
      <damaged_item>Dr. Carver's Easy Shave Butter (6 oz) - Exploded in box</damaged_item>
      <next_bill_date>Tomorrow</next_bill_date>
      <subscription>Shave Butter + 6-Blade Club</subscription>
      <policy>Replace damaged product free of charge (ships in 24 hours). Billing update required tomorrow: never take credit cards in chat; send secure Shop Pay link via SMS and email.</policy>
    </customer>
  </mock_database>

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
    patchPayload.toolsets = [{ toolset: dscToolset.name }];
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

#!/usr/bin/env node

/**
 * CX Agent Studio Offline Test Suite & Specification Validator
 * Zero Financial Spend ($0.00)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const agentYamlPath = path.join(__dirname, '../spec/agent.yaml');
const toolsYamlPath = path.join(__dirname, '../spec/tools.yaml');
const scenariosPath = path.join(__dirname, '../scenarios/scenarios.json');
const goldenPath = path.join(__dirname, '../golden/golden_tests.json');

console.log('=== [CXAS] Offline Specification & Scenario Validation ===');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// 1. Validate agent.yaml
console.log('\n1. Validating Agent Specification (agent.yaml)...');
let agentConfig;
try {
  const content = fs.readFileSync(agentYamlPath, 'utf8');
  agentConfig = yaml.parse(content);
  assert(!!agentConfig.app, 'App block defined');
  assert(!!agentConfig.root_agent, 'Root agent block defined');
  assert(Array.isArray(agentConfig.root_agent.workflows), 'Workflows array defined');
  assert(agentConfig.root_agent.workflows.length >= 4, `At least 4 core workflows declared (found ${agentConfig.root_agent.workflows.length})`);
  assert(Array.isArray(agentConfig.root_agent.guardrails), 'Guardrails array defined');
  assert(Array.isArray(agentConfig.root_agent.tools), 'Tools array defined');
} catch (e) {
  assert(false, `Could not parse agent.yaml: ${e.message}`);
}

// 2. Validate tools.yaml
console.log('\n2. Validating Tools Specification (tools.yaml)...');
let toolsConfig;
const declaredTools = new Set();
try {
  const content = fs.readFileSync(toolsYamlPath, 'utf8');
  toolsConfig = yaml.parse(content);
  assert(Array.isArray(toolsConfig.tools), 'Tools array defined');
  for (const t of toolsConfig.tools) {
    assert(!!t.name && !!t.description, `Tool "${t.name}" has valid name and description`);
    declaredTools.add(t.name);
  }
} catch (e) {
  assert(false, `Could not parse tools.yaml: ${e.message}`);
}

// Check agent tools match tools.yaml
if (agentConfig && agentConfig.root_agent && Array.isArray(agentConfig.root_agent.tools)) {
  for (const tool of agentConfig.root_agent.tools) {
    assert(declaredTools.has(tool.name), `Agent tool "${tool.name}" is implemented in tools.yaml`);
  }
}

// 3. Validate scenarios.json
console.log('\n3. Validating Multi-Turn Customer Scenarios (scenarios.json)...');
let scenariosData;
try {
  scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
  assert(Array.isArray(scenariosData.scenarios), 'Scenarios array defined');
  assert(scenariosData.scenarios.length === 3, `Expected 3 customer scenarios (found ${scenariosData.scenarios.length})`);

  for (const sc of scenariosData.scenarios) {
    assert(!!sc.id && !!sc.customer && !!sc.title, `Scenario ${sc.id} for ${sc.customer} is fully titled`);
    assert(Array.isArray(sc.turns) && sc.turns.length >= 2, `Scenario ${sc.id} has ${sc.turns.length} turns`);

    // Verify turn alternation and tool names
    for (let i = 0; i < sc.turns.length; i++) {
      const turn = sc.turns[i];
      const expectedSpeaker = i % 2 === 0 ? 'user' : 'agent';
      assert(turn.speaker === expectedSpeaker, `Scenario ${sc.id} turn ${i + 1} speaker is ${expectedSpeaker}`);

      if (turn.expected_tool_call) {
        assert(declaredTools.has(turn.expected_tool_call), `Expected tool "${turn.expected_tool_call}" is valid`);
      }
      if (Array.isArray(turn.expected_tool_calls)) {
        for (const tc of turn.expected_tool_calls) {
          assert(declaredTools.has(tc), `Expected tool "${tc}" is valid`);
        }
      }
    }
  }
} catch (e) {
  assert(false, `Could not parse scenarios.json: ${e.message}`);
}

// 4. Validate golden_tests.json
console.log('\n4. Validating Golden Test Cases (golden_tests.json)...');
let goldenData;
try {
  goldenData = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));
  assert(Array.isArray(goldenData.test_cases), 'Test cases array defined');
  assert(goldenData.test_cases.length >= 6, `At least 6 golden test cases present (found ${goldenData.test_cases.length})`);

  for (const tc of goldenData.test_cases) {
    assert(!!tc.id && !!tc.input, `Golden case ${tc.id} has input utterance`);
    if (tc.expected_tool) {
      assert(declaredTools.has(tc.expected_tool), `Golden case ${tc.id} expected tool "${tc.expected_tool}" is valid`);
    }
  }
} catch (e) {
  assert(false, `Could not parse golden_tests.json: ${e.message}`);
}

// Summary
console.log('\n---------------------------------------------------------');
console.log(`Validation Results: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`Financial Cost: $0.00 USD (100% offline local evaluation)`);
console.log('---------------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('All CX Agent Studio offline validations succeeded!\n');
  process.exit(0);
}

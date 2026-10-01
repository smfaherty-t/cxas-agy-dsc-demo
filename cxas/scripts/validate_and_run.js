#!/usr/bin/env node

/**
 * CX Agent Studio Test Runner with Strict Spend Gate
 * Cost per session: $0.50 USD
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const goldenPath = path.join(__dirname, '../golden/golden_tests.json');
const scenariosPath = path.join(__dirname, '../scenarios/scenarios.json');

console.log('=== CX Agent Studio Offline Test Suite Validation ===\n');

// 1. Local Schema Validation
let goldenData;
let scenarioData;

try {
  goldenData = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));
  console.log(`[PASS] Loaded golden tests suite: "${goldenData.suite}" with ${goldenData.test_cases.length} test cases.`);
} catch (err) {
  console.error(`[FAIL] Could not parse golden tests: ${err.message}`);
  process.exit(1);
}

try {
  scenarioData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
  console.log(`[PASS] Loaded scenario tests suite: "${scenarioData.suite}" with ${scenarioData.scenarios.length} scenarios.`);
} catch (err) {
  console.error(`[FAIL] Could not parse scenarios: ${err.message}`);
  process.exit(1);
}

const totalSessions = goldenData.test_cases.length + scenarioData.scenarios.length;
const costPerSession = 0.50;
const totalCostUsd = (totalSessions * costPerSession).toFixed(2);

console.log('\n---------------------------------------------------------');
console.log(`Planned Sessions: ${totalSessions} (${goldenData.test_cases.length} golden + ${scenarioData.scenarios.length} scenarios)`);
console.log(`Cost Rate: $${costPerSession.toFixed(2)} / session`);
console.log(`Estimated Financial Spend: $${totalCostUsd} USD`);
console.log('---------------------------------------------------------');

// 2. Spend Gate Check
const isApproved = process.env.CXAS_SPEND_APPROVED === 'true';

if (!isApproved) {
  console.log('\n[BLOCKED BY GOVERNANCE POLICY]');
  console.log('Live CX Agent Studio sessions incur real financial cost.');
  console.log(`APPROVAL REQUIRED: User must explicitly approve $${totalCostUsd} USD for ${totalSessions} sessions.`);
  console.log('To run live after receiving user sign-off, invoke with CXAS_SPEND_APPROVED=true');
  console.log('Exiting safely with $0.00 spent.');
  process.exit(0);
}

console.log('\n[AUTHORIZED] CXAS_SPEND_APPROVED=true detected. Proceeding with authorized session runner...');

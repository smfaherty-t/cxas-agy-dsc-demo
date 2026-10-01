# CX Agent Studio (CCAI) Testing & Governance

This directory contains offline test definitions and governance automation for the Dollar Shave Club Conversational Agent built on Google Cloud CX Agent Studio (CCAI).

## Deployment Metadata
- **Project**: `sa-training-466722` (Numeric Project ID: `137470913560`)
- **Location**: `us`
- **App ID**: `82a19631-fe39-40fa-a593-60778d958407`
- **Deployment ID**: `93ef4da3-d0a5-4db9-b686-cb0f5a2537fb`
- **Resource URI**: `projects/137470913560/locations/us/apps/82a19631-fe39-40fa-a593-60778d958407/deployments/93ef4da3-d0a5-4db9-b686-cb0f5a2537fb`

---

## Financial Spend Policy & Session Cost Guardrail
> [!CAUTION]
> **Live sessions against CX Agent Studio incur financial cost ($0.50 per session).**
> **Zero Unapproved Sessions**: Autonomous agents and engineers are strictly forbidden from initiating live sessions without prior explicit business approval from the user.

### Formula
$$\text{Cost} = \text{Sessions} \times \$0.50\text{ USD}$$

### Approval Request Format
Prior to running any test batch:
```
I would like to execute [N] CX Agent Studio test session(s) covering [Scenarios].
Cost Calculation: [N] sessions * $0.50 = $[N * 0.50] USD.
Do you approve running these sessions?
```

---

## Test Suites (Authored Offline at $0 Cost)
1. **Golden Tests (`cxas/golden/`)**: Single-turn assertions for intent, sentiment, parameter extraction, and safety guardrails.
2. **Scenario Tests (`cxas/scenarios/`)**: Multi-turn conversation flows testing end-to-end task fulfillment, slot filling, and fallback escalation.

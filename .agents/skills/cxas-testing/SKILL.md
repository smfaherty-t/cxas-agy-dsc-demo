---
name: cxas-testing
description: Strict governance and operational procedure for authoring and running CX Agent Studio golden and scenario tests with mandatory financial spend approval.
---

# CX Agent Studio (CXAS) Testing & Spend Governance

Use this skill whenever authoring, reviewing, or preparing to execute tests against Google Cloud CX Agent Studio / CCAI agents.

## MANDATORY FINANCIAL APPROVAL RULE
> [!CAUTION]
> Every live session against CX Agent Studio costs **$0.50 USD**. You are strictly prohibited from initiating or executing any test session without PRIOR, EXPLICIT USER APPROVAL.

### Spend Calculation Formula
$$\text{Total Cost} = \text{Number of Sessions} \times \$0.50\text{ USD}$$

### Required Approval Request Format
Before running ANY live CX Agent Studio test suite or session, prompt the user with:
```
I would like to execute [N] CX Agent Studio test session(s) covering [Specific Scenarios/Golden Tests].
Cost Calculation: [N] sessions * $0.50 = $[N * 0.50] USD.
Do you approve running these sessions?
```
Do NOT execute if approval is withheld, ambiguous, or pending.

## Offline Test Authoring (Zero Cost)
You can author, refine, and review test specifications completely offline with $0 spend:
1. **Scenario Tests**: Multi-turn dialog flows specifying user utterances, expected agent tool calls, state transitions, and responses. Save under `cxas/scenarios/`.
2. **Golden Tests**: Standard intent classification and entity extraction test assertions. Save under `cxas/golden/`.
3. Validate JSON schemas, flow syntax, and coverage locally before requesting any budget.

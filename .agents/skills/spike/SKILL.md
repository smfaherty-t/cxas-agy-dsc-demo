---
name: spike
description: Timeboxed architectural investigation and prototyping framework for resolving technical unknowns.
---

# Spike (Investigation & Prototyping) Workflow

Use this skill when exploring third-party integrations, evaluating design alternatives, or assessing architectural trade-offs.

## Standard Procedure

1. **Scope & Question Formulation**:
   - Create a GitHub Issue with the label `spike`.
   - Articulate the specific technical hypothesis or unknown to answer.

2. **Timeboxed Exploration**:
   - Write experimental code or run investigative scripts (e.g., in scratch/ or a dedicated branch).
   - Evaluate performance, compatibility, token footprint, and complexity.

3. **Synthesis & Architectural Decision**:
   - Summarize findings in the GitHub Issue or in an Architectural Decision Record (`docs/adr/`).
   - If findings lead to new capabilities, transition to the `build-feature` skill.

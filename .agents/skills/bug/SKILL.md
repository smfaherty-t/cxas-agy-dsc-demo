---
name: bug
description: Systematic process for triaging, reproducing, fixing, testing, and documenting bugs to guarantee zero recurrence.
---

# Bug Resolution Workflow

Use this skill when diagnosing, fixing, or preventing software defects.

## Standard Procedure

1. **Reproduction & GitHub Issue**:
   - Verify bug report or create GitHub Issue (`gh issue create --title "fix: <defect-summary>" --body "..." --label "bug"`).
   - Write a minimal reproduction test case in the test suite that fails.

2. **Root Cause Analysis (RCA)**:
   - Identify the exact mechanism of failure.
   - Fix the underlying cause (no band-aids or workarounds).

3. **Verify Locally**:
   - Run local test suite (`npm test`) to confirm the reproduction test now passes and no regressions exist.

4. **Document & Learn**:
   - If this was a preventable design flaw, log an entry in `docs/learnings.md`.
   - Commit using Conventional Commits: `fix(<scope>): <description> (fixes #<issue_number>)`.

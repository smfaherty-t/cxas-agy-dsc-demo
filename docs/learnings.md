# Architectural & Operational Learnings

This document is the repository's permanent institutional memory. Whenever an unexpected error, edge-case, or anti-pattern is encountered, record it here so no engineer or agent pays for the same mistake twice.

## Rules for Adding Learnings
1. **Identify Root Cause**: Not just what broke, but why it happened.
2. **Actionable Mitigation**: Specific rule or guardrail to prevent recurrence.
3. **Reference**: Link to related GitHub issue or PR.

---

### [2026-10-01] Learning 1: Sandbox Network Isolation & Keyring Access
- **Issue**: Standard sandbox commands cannot make outbound network requests or read macOS keychain credentials (e.g. `gh` token in osxkeychain).
- **Mitigation**: Commands requiring authenticated GitHub API operations (`gh issue ...`, `git push`) must use `BypassSandbox: true` so the tool can reach the host network and OS keychain safely. Run all compilation, linting, and local tests inside the default sandbox.

### [2026-10-01] Learning 2: Web Component Hydration in React
- **Issue**: Custom web components like Google CCAI `<chat-messenger>` can conflict with React SSR hydration or re-renders if managed as controlled virtual DOM elements.
- **Mitigation**: Place `<chat-messenger>` directly in static `index.html` or mount it via raw un-re-rendered container to ensure the external Google script can safely mutate the DOM without React lifecycle collisions.

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

### [2026-10-01] Learning 3: Positioning Google CCAI Chat Messenger in the Lower-Left Corner
- **Issue**: Google's `chat-messenger-layout.css` and internal web components hardcode `position: fixed; right: 16px; bottom: 16px;` and default rightward slide animations. Furthermore, providing `<chat-messenger-container>` disables the default circular bubble launcher.
- **Mitigation**:
  1. Position `<chat-messenger>` explicitly using `position: fixed !important; left: 24px !important; bottom: 96px !important; right: auto !important; transform-origin: bottom left !important;`.
  2. Implement an accessible dedicated floating launcher bubble in the lower-left (`bottom: 24px; left: 24px; z-index: 9999`) that toggles the chat window class `dsc-chat-closed`.
  3. Listen to native CCAI events (`chat-messenger-close`, `chat-messenger-dialog-toggled`, `chat-messenger-dialog-closed`) to sync window collapse state cleanly back to the lower-left bubble launcher.
  4. Inject an override style into `chat-messenger.shadowRoot` to ensure any internal Google `.chat-bubble-default-wrapper` is hidden or repositioned to the left.


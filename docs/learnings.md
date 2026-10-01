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

### [2026-10-01] Learning 4: Idempotent Event Binding for Asynchronous Third-Party Web Components
- **Issue**: Google CCAI's SDK script loads asynchronously and fires `chat-messenger-loaded` after DOMContentLoaded. Binding event listeners in a controller function called across both `DOMContentLoaded` and `chat-messenger-loaded` caused duplicate click event handlers on the launcher button. On click, the first handler toggled the chat open and the second immediately toggled it closed in the same event dispatch loop, rendering the launcher non-responsive.
- **Mitigation**:
  1. Guard controller setup with an explicit idempotency flag (`window.__cxasBubbleControllerInitialized`) so DOM listeners and initial state configurations execute strictly once.
  2. Declare the global API functions (`openCxasChat`, `closeCxasChat`, `toggleCxasChat`) unconditionally on `window` immediately so external call sites never encounter race conditions.
  3. Keep the asynchronous SDK event listener (`chat-messenger-loaded`) strictly focused on context registration (`chatSdk.registerContext`) and shadow DOM patching.
  4. Ensure `chat-toggle-dialog-button` (fullscreen mode toggler) is not conflated with widget close; only explicit close events (`chat-messenger-close`) should close the chat window.
### [2026-10-01] Learning 5: Monorepo Workspace Scoping & Test Environment Isolation
- **Issue**: Running root-level test and build runners (`npm test --workspaces`, `npm run build --workspaces`) across heterogeneous packages (e.g., React web app using `jsdom` vs. backend API using `node` vs. declarative agent validator) can cause cross-workspace config leaks. Specifically, Vite and Vitest can inherit root configs (looking for non-existent root setup files), or attempt TCP socket binds that fail in sandboxed CI environments.
- **Mitigation**:
  1. Maintain an independent `tsconfig.json` and `vitest.config.ts` inside each workspace package (`apps/web`, `apps/api`, `apps/agent`).
  2. Root `tsconfig.json` acts as a project references orchestrator without polluting child compilation contexts.
  3. Backend unit and integration tests should evaluate business logic, service layers, and database mutations in-memory rather than relying on ephemeral TCP sockets, ensuring 100% sandboxed test execution without socket permission requirements.
  4. Ensure every workspace package exports standard npm lifecycle scripts (`build`, `test`) so root single commands execute predictably.
- **Reference**: [GitHub Issue #8](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/8)

### [2026-10-01] Learning 6: Google Cloud Run v2 Reserved Environment Variables
- **Issue**: Declaring `PORT` in the `template.containers.env` block of a `google_cloud_run_v2_service` Terraform resource causes deployment failure (`Error 400: template.containers[0].env: The following reserved env names were provided: PORT. These values are automatically set by the system.`).
- **Mitigation**:
  1. Never declare `PORT` in `google_cloud_run_v2_service` container `env` blocks. Cloud Run automatically injects and sets `PORT=8080`.
  2. In application entrypoints (`server.ts`, `server.js`), always default to `process.env.PORT || '8080'`.
  3. Keep container environment variables restricted to application-specific runtime flags (`NODE_ENV`, custom configuration).
- **Reference**: [GitHub Issue #11](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/11)

### [2026-10-01] Learning 7: CX Agent Studio Web Widget Public Access & Console Multi-Region Visibility
- **Issue**:
  1. The web chat widget (`chat-messenger`) fails with errors during user interaction if `channelProfile.webWidgetConfig.securitySettings.enablePublicAccess` is false or omitted (requiring an explicit OAuth bearer token).
  2. Agents created in multi-region `us` do not show up in the Google Cloud Console if the region filter is set to a regional zone (such as `us-central1`), or if the display name was previously set to an internal ID/label.
- **Mitigation**:
  1. For public demo webchats, always explicitly patch `channelProfile.webWidgetConfig.securitySettings.enablePublicAccess = true` on the deployment resource.
  2. Ensure the app `displayName` matches the official brand name (`Dollar Shave Club`).
  3. Ensure the Console location dropdown is set to `us` (United States multi-region) or `All locations` when viewing apps.

### [2026-10-01] Learning 8: CX Agent Studio External Tool Integration Requires OpenAPI Toolsets (`openApiToolset`)
- **Issue**:
  1. Attempting to create individual tools of type `OpenApiTool` via `POST .../apps/{appId}/tools` is rejected by Customer Engagement Suite (CES) API with `Creating tools of type OpenApiTool is not supported. Please use OpenApi Toolsets instead.`.
  2. Without an OpenAPI Toolset registered on the app and attached to the root agent (`agent.toolsets: [{ toolset: toolsetName }]`), the virtual agent cannot call the backend Cloud Run API to perform live order tracking, address updates, or replacement requests.
- **Mitigation**:
  1. Register external APIs using the `toolsets` resource endpoint: `POST /v1/projects/{project}/locations/{location}/apps/{app}/toolsets` with payload `{ displayName: "...", openApiToolset: { openApiSchema: JSON.stringify(spec) } }`.
  2. Attach the created toolset to the agent using the `toolsets` array of `AgentToolset` objects: `agent.toolsets = [{ toolset: toolsetName }]`.
  3. Automate toolset creation, schema updates, agent attachment, version snapshotting, and deployment updating in `apps/agent/scripts/sync_agent.js`.





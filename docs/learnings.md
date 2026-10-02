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

### [2026-10-01] Learning 8: CX Agent Studio External Tool Integration Requires OpenAPI Toolsets (`openApiToolset`) with Explicit `toolIds`
- **Issue**:
  1. Attempting to create individual tools of type `OpenApiTool` via `POST .../apps/{appId}/tools` is rejected by Customer Engagement Suite (CES) API with `Creating tools of type OpenApiTool is not supported. Please use OpenApi Toolsets instead.`.
  2. When attaching an `openApiToolset` to an `Agent` (`agent.toolsets`), if `toolIds` is omitted or empty, CES assigns zero tools to the agent. The agent remains unaware of the API endpoints and cannot invoke them.
  3. If mock data is embedded directly in prompt context (`<mock_database>`), the LLM may answer from context or hallucinate instead of executing API tool calls.
- **Mitigation**:
  1. Register external APIs using the `toolsets` resource endpoint: `POST /v1/projects/{project}/locations/{location}/apps/{app}/toolsets` with payload `{ displayName: "...", openApiToolset: { openApiSchema: JSON.stringify(spec) } }`.
  2. Attach the created toolset to the agent using the `Agent.toolsets` array of `AgentToolset` objects with explicit `toolIds` corresponding to the OpenAPI `operationId`s:
     ```json
     {
       "toolset": "projects/.../locations/.../apps/.../toolsets/...",
       "toolIds": ["trackOrder", "updateShippingAddress", "createReplacementOrder", "delayRestockBox", "sendSecurePaymentLink"]
     }
     ```
  3. Include strict mandatory tool invocation rules in `<tool_guidelines>` within the agent prompt so the model consistently executes the registered tools.
  4. Always snapshot a new version and update the deployment after patching agent toolsets.
### [2026-10-01] Learning 9: Real-Time Mutation Synchronization & Address Cascading Across GenAI Agents and Dashboards
- **Issue**:
  1. When a conversational agent mutates an entity (e.g. updating a customer shipping address via tool invocation), active in-transit orders or pending shipments can easily become out of sync if only the root entity is updated.
  2. For dual-screen executive demonstrations, webhooks/WebSockets add excessive deployment overhead and connection fragility, while static manual reloads ruin the "magic moment" of seeing live AI tool execution.
  3. In Express 5 with `@types/express`, `req.params.identifier` is typed as `string | string[]`, causing TypeScript compilation errors when passed directly to database lookup functions expecting `string`.
- **Mitigation**:
  1. **Cascade Mutations**: In `DatabaseStore.updateCustomerAddress()`, automatically cascade address updates to any non-terminal orders (`IN_TRANSIT`, `PROCESSING`, `LOST_IN_TRANSIT`) so the destination address immediately updates across the system.
  2. **Lightweight Polling with Diff Detection**: Implement 3-second interval polling (`GET /api/customers`) on the operations dashboard, caching prior address hashes. When a diff is detected, trigger visual CSS animations (`animate-pulse-glow`) and animated toast banners so observers see mutations without page reloads.
  3. **Express 5 Param Normalization**: Always normalize request parameters using `const id = Array.isArray(raw) ? raw[0] : raw;` before passing to services.
- **Reference**: [GitHub Issue #12](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/12), [GitHub Issue #13](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/13)

### [2026-10-01] Learning 10: React Context Fallbacks for Resilient Isolated Component Testing
- **Issue**: Introducing a React Context (`CartContext`) across components can break existing isolated unit tests that mount child components (`<Header />`, `<StarterSetConfigurator />`) directly without wrapping them in `<CartProvider>`, resulting in `useCart must be used within a CartProvider` errors.
- **Mitigation**:
  1. In the custom hook (`useCart`), return a complete `defaultCartContext` with safe no-op handlers rather than throwing an exception when `useContext` returns `undefined`.
  2. This preserves full composability and testing ergonomics: components function independently in unit tests without boilerplate mocking, while fully connecting to dynamic application state when rendered inside `<App />` and `<CartProvider>`.
- **Reference**: [GitHub Issue #14](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/14)

### [2026-10-02] Learning 11: CXAS Welcome Cards, Retention Workflows, and Multi-Modal Visual Damage Analysis
- **Issue**:
  1. Standard conversational agent chat containers open with an empty canvas or blank prompt line, leaving customers unsure what actions they can take.
  2. Immediate cancellation requests cause unnecessary subscription churn if the agent executes cancellation without presenting retention alternatives (box delay or cadence adjustment).
  3. Processing damaged merchandise claims without physical verification exposes retail subscriptions to fraudulent replacement claims.
- **Mitigation**:
  1. **Docked Welcome Greeting & Quick Inquiries Card**: Render a dedicated branded greeting card (`#cxas-welcome-card`) inside `<chat-messenger-container>`. Provide interactive quick buttons for top inquiries (`Order status`, `Change address`, `Order arrived at wrong address`, `Report damaged product`, `Cancel / Pause subscription`). Clicking any button immediately dispatches that content into the conversational session and smoothly transitions the card to a compact horizontal chip tray so the message transcript remains unobstructed.
  2. **Subscription Retention Gate**: Enforce guardrails in the agent instruction set requiring the agent to ALWAYS offer to delay the upcoming Restock Box (`delayRestockBox`) or change delivery cadence (`updateSubscriptionCadence` to Every 2 Months or Every 3 Months) before processing cancellation requests.
  3. **Visual Damage Analysis & Verification**: Provide both native file upload in chat and a dedicated interactive Photo Damage Inspection modal (`DamageReportModal`) that inspects uploaded photos using AI vision heuristics (container burst, leaking shave butter, fractured razor collar, crushed packaging), validates damage authenticity with a confidence score, and automatically authorizes free replacement dispatch (`createReplacementOrder`).
- **Reference**: [GitHub Issue #15](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/15)

### [2026-10-02] Learning 12: Google CCAI Shadow DOM Message Header Slots & Gemini Multimodal Chat Vision
- **Issue**:
  1. `<chat-messenger-container>` uses Web Component Shadow DOM. Elements placed in light DOM without a supported slot attribute are ignored and not rendered inside the chat dialog.
  2. In Google CCAI `<chat-messenger>`, calling `cm.sendQuery(text)` sends the query to the CES backend but does NOT automatically display the user's speech bubble in the transcript.
  3. When an agent is configured with Gemini (`gemini-3.1-flash-live`), requiring a synthetic external OpenAPI tool for photo analysis creates unnecessary latency and brittle validation failures. Gemini natively inspects multimodal image parts attached to user messages.
- **Mitigation**:
  1. **Slotted Message Header**: Provide `slot="messages-header"` on custom greeting/quick-action containers so they project into the top of `#message-list` inside the shadow root.
  2. **Dual-Dispatch Transcript Rendering**: When programmatically triggering user actions from button clicks, invoke `cm.renderCustomText(text, false)` first to render the customer chat bubble, then dispatch `cm.sendQuery(text)` to invoke CES. Include a recursive shadow root search (`findInShadow`) as fallback.
  3. **Gemini Multimodal Vision Instructions**: Configure agent instructions to use Gemini's multimodal vision directly on uploaded photos, checking for cracked razor handles, ruptured seals, and leaked contents before invoking `createReplacementOrder`.
- **Reference**: [GitHub Issue #15](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/15)

### [2026-10-02] Learning 13: CX Agent Studio Multimodal Photo Upload Protocol (`service` Attribute & Direct Slotting)
- **Issue**:
  1. In Google Cloud CX Agent Studio (`chat-messenger.js`), selecting a photo for damage inspection resulted in an immediate client-side rejection: `Error: sendImage is only supported for CES service, but current service is dialogflow`.
  2. Custom welcome card buttons were nested inside `<chat-messenger-container>`, preventing `<chat-messenger>`'s shadow DOM from projecting `slot="messages-header"` into the message list.
- **Root Cause**:
  1. `<chat-messenger>` defaults its service type to `dialogflow` unless explicitly supplied with the CES service JSON attribute: `service='{"name":"ces","deployment-id":"projects/PROJECT_ID/locations/REGION/apps/APP_ID/deployments/DEPLOYMENT_ID"}'`. `sendImage` strictly gates upload execution on `service.name === "ces"`.
  2. In the CCAI Web Component hierarchy, `<chat-messenger>`'s shadow root forwards `slot="messages-header"` only from its direct children to `<chat-messenger-container>`, which then forwards it to `<chat-messenger-message-list>`.
- **Mitigation**:
  1. Always declare `service='{"name":"ces","deployment-id":"..."}'` and `enable-file-upload="true"` directly on `<chat-messenger>`.
  2. Place `#cxas-welcome-card` with `slot="messages-header"` as a direct child of `<chat-messenger>`.
  3. Listen to both `chat-messenger-loaded` and `chat-messenger-message-list-loaded` events to ensure interactive inquiry buttons are bound immediately upon message list attachment.
- **Reference**: [GitHub Issue #16](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/16)

### [2026-10-02] Learning 14: Asynchronous Multimodal Image Architecture for Conversational Agents
- **Issue**: Standard conversational agent streams and CCAI Web Messenger streaming endpoints (`sendImage` over bidirectional SSE/WebSocket connections) cannot handle raw binary image streams inside standard text query payloads without throwing client connection errors or dropping image parts.
- **Root Cause**:
  1. Chatbot interfaces operate over textual turn-by-turn protocols; injecting mega-byte binary payloads directly into live streaming session frames can saturate or break the session pipe.
  2. Per Google Cloud architecture guidance, robust multimodal processing requires an asynchronous multi-step pipeline: client-side interception -> cloud storage persistence -> backend multimodal model invocation (Vertex AI Gemini) -> verified outcome injection into session context.
- **Mitigation**:
  1. **Client-Side Interception**: Intercept file selections via a titlebar action button (`#cxas-titlebar-upload-btn`), custom events (`trigger-photo-upload`, `chat-messenger-button-clicked`), and drag-and-drop.
  2. **Cloud Storage Pipeline**: Persist customer-uploaded damage photos to a dedicated GCS bucket (`gs://sa-training-466722-damage-photos/`) with web CORS enabled.
  3. **Vertex AI Gemini Multimodal Inspection**: Call `gemini-2.5-flash:generateContent` using project credentials, supplying the image part (`fileData` URI or inline base64) alongside structured damage assessment instructions.
  4. **Context Injection & Rich Visual Feedback**: Render an inline visual card with the image thumbnail, severity rating, and authorized replacement ID (`#DSC-7721-R1`) directly inside the chat interface, and send the verified result into the agent session for seamless confirmation.
- **Reference**: [GitHub Issue #17](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/17)


# Changelog

## [0.2.0](https://github.com/smfaherty-t/cxas-agy-dsc-demo/compare/cxas-agy-dsc-demo-v0.1.0...cxas-agy-dsc-demo-v0.2.0) (2026-10-02)


### Features

* **agent,web,api:** add chat greeting with quick buttons, cancellation retention, and photo damage analysis ([2808210](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/28082105dd34ff455e4b3a01eb9e079b7aff9cc4))
* **agent:** automate version creation and deployment update during agent sync ([79f8331](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/79f8331b8a18cb53047842bb76c3f0d374026ab8))
* **agent:** enable Gemini multimodal photo damage analysis and fix chat header buttons ([5fa7aa6](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/5fa7aa63c01ca1ff5def7db6cae15de724cf585f))
* **dashboard:** add operations dashboard and seed 10 customers ([#12](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/12)) ([be6e08e](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/be6e08e629ccde899185b35a9c5d0db9c94620d8))
* **infra:** deploy cloud run services via terraform and run cxas evaluations ([eaa5ab1](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/eaa5ab1d03df4601d930ace0fb560031bc878deb))
* initialize Dollar Shave Club demo website and CX Agent Studio governance ([b572ef9](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/b572ef9eb39d0473aec6565985306082b3667325))
* position CX Agent Studio chat widget as a floating bubble in lower-left corner (closes [#6](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/6)) ([dbf669b](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/dbf669b83d0d93ac66598af0fbb8a4ebb06d0c39))
* transform to monorepo with backend api, cxas agent, and terraform ([cafd970](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/cafd970d346dd687766a635250debbe2460f4922))
* **web:** hook native in-chat '+' button for photo damage upload and remove pop-up card ([74b49f1](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/74b49f1e6825e3976bd5afa00e6a62a41810db62))
* **web:** reconstruct Dollar Shave Club No Frills Starter Set storefront with embedded CX Agent Studio ([#14](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/14)) ([6bb6bb2](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/6bb6bb21eebe9cb26d105686df8b1061b86d07e6))


### Bug Fixes

* **agent:** attach openapi toolset to root agent and sync deployment ([2f4b3ca](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/2f4b3caba36107407c5ad8f99650b9ebd7ce927d))
* **agent:** configure toolIds on agent toolsets and add mandatory tool guidelines ([31b7856](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/31b7856804791577d9deb6ffdfc70d66c56207d6))
* prevent duplicate click handlers on lower-left bubble launcher (fixes [#7](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/7)) ([2dee928](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/2dee928059cccbac4b8686a5121e6c8f8f020c73))
* **web:** add tokenBroker and proactive chat session token resolution ([ea33c0b](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/ea33c0b940728d4b415b3799deda2e0f0df74403))
* **web:** enable CES multimodal photo analysis and streamline welcome card buttons ([2de1a84](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/2de1a843b3d634bdcd48469af24cc35f024e0a60))
* **web:** implement asynchronous multimodal photo upload pipeline and Gemini vision verification ([#17](https://github.com/smfaherty-t/cxas-agy-dsc-demo/issues/17)) ([390e718](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/390e71894e2eef91914a9d05a2aa4d05ede52586))
* **web:** require account email before photo upload and use live Gemini AI vision damage inspection ([2472356](https://github.com/smfaherty-t/cxas-agy-dsc-demo/commit/2472356b0d61b7a1fe729046606278132051eab7))

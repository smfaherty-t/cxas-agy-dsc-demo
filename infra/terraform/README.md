# Dollar Shave Club Demo - Terraform Infrastructure

This directory manages the Google Cloud Platform infrastructure for the Dollar Shave Club demo using Terraform.

## Managed Resources
- **Google Artifact Registry**: Docker repository for storing container images (`web` and `api`).
- **Google Cloud Run Services**:
  - `cxas-dsc-web`: Frontend web storefront.
  - `cxas-dsc-api`: Backend customer service and order tracking API.
- **Service Accounts & IAM**: Minimal-privilege execution service accounts with public unauthenticated invocations for demo access.

## Prerequisites
1. [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) authenticated (`gcloud auth login`).
2. [Terraform](https://www.terraform.io/) >= 1.5.0 installed.
3. Access to GCP project `sa-training-466722`.

## Live Endpoints
- **Web Storefront**: [https://cxas-dsc-web-z66d5k5ioa-uc.a.run.app](https://cxas-dsc-web-z66d5k5ioa-uc.a.run.app)
- **Backend API**: [https://cxas-dsc-api-z66d5k5ioa-uc.a.run.app](https://cxas-dsc-api-z66d5k5ioa-uc.a.run.app)
- **OpenAPI Schema**: [https://cxas-dsc-api-z66d5k5ioa-uc.a.run.app/api/openapi.json](https://cxas-dsc-api-z66d5k5ioa-uc.a.run.app/api/openapi.json)
- **Artifact Registry**: `projects/sa-training-466722/locations/us-central1/repositories/cxas-dsc-demo`

## Operations (Single Root Commands)

### 1. Preview Changes
```bash
npm run tf:plan
```

### 2. Deploy / Upgrade Infrastructure
```bash
npm run tf:apply
```

### 3. Teardown / Destroy Infrastructure
To completely tear down all provisioned Cloud Run services, repositories, and IAM bindings:
```bash
npm run tf:destroy
```

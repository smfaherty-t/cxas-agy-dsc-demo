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

## Operations

### 1. Initialization
```bash
terraform init
```

### 2. Preview Changes
```bash
terraform plan
```

### 3. Deploy / Upgrade Infrastructure
```bash
terraform apply
```

### 4. Teardown / Destroy Infrastructure
To completely tear down all provisioned Cloud Run services, repositories, and IAM bindings:
```bash
terraform destroy
```

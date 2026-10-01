#!/usr/bin/env bash
set -e

PROJECT_ID="sa-training-466722"
SERVICE_NAME="cxas-dsc-demo"
REGION="us-central1"

echo "=== Deploying Dollar Shave Club Webchat Demo to Cloud Run ==="
echo "Project:  ${PROJECT_ID}"
echo "Service:  ${SERVICE_NAME}"
echo "Region:   ${REGION}"
echo "==========================================================="

gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080

echo "Deployment successful! Check the service URL above."

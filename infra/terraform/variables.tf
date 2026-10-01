variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
  default     = "sa-training-466722"
}

variable "region" {
  description = "Google Cloud region for services"
  type        = string
  default     = "us-central1"
}

variable "ces_location" {
  description = "Google Cloud multi-region location for Customer Engagement Suite (CES)"
  type        = string
  default     = "us"
}

variable "artifact_repo_name" {
  description = "Name of the Artifact Registry repository"
  type        = string
  default     = "cxas-dsc-demo"
}

variable "web_service_name" {
  description = "Cloud Run service name for the frontend web app"
  type        = string
  default     = "cxas-dsc-web"
}

variable "api_service_name" {
  description = "Cloud Run service name for the backend API"
  type        = string
  default     = "cxas-dsc-api"
}

variable "web_image" {
  description = "Container image URL for the web service"
  type        = string
  default     = "us-central1-docker.pkg.dev/sa-training-466722/cxas-dsc-demo/web:latest"
}

variable "api_image" {
  description = "Container image URL for the API service"
  type        = string
  default     = "us-central1-docker.pkg.dev/sa-training-466722/cxas-dsc-demo/api:latest"
}

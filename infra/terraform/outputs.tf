output "web_service_uri" {
  description = "The public URL of the Dollar Shave Club frontend web service"
  value       = google_cloud_run_v2_service.web.uri
}

output "api_service_uri" {
  description = "The public URL of the Dollar Shave Club backend API service"
  value       = google_cloud_run_v2_service.api.uri
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repository ID"
  value       = google_artifact_registry_repository.docker_repo.id
}

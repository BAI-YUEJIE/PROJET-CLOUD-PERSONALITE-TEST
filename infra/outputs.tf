output "api_endpoint" {
  description = "URL complète à copier dans VITE_API_URL du frontend"
  value       = "http://localhost:4566/restapis/${aws_api_gateway_rest_api.api.id}/dev/_user_request_"
}

output "dynamodb_table" {
  value = aws_dynamodb_table.results.name
}

output "reports_bucket" {
  value = aws_s3_bucket.reports.bucket
}

output "sqs_queue_url" {
  value = aws_sqs_queue.report_queue.id
}

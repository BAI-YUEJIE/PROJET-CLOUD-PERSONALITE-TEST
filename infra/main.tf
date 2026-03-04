terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region                      = var.region
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  endpoints {
    apigateway     = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    s3             = "http://localhost:4566"
    sqs            = "http://localhost:4566"
    cloudwatchlogs = "http://localhost:4566"
  }
}

# DynamoDB table to store results
resource "aws_dynamodb_table" "results" {
  name         = "${var.project_name}-results"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "resultId"

  attribute {
    name = "resultId"
    type = "S"
  }
}

# S3 bucket for reports
resource "aws_s3_bucket" "reports" {
  bucket = "${var.project_name}-reports"
}

# SQS queue to trigger report generation
resource "aws_sqs_queue" "report_queue" {
  name = "${var.project_name}-report-queue"
}

# common IAM role for Lambda functions
resource "aws_iam_role" "lambda_exec" {
  name               = "${var.project_name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

# attach minimal policies (DynamoDB, SQS, S3) for all functions
resource "aws_iam_role_policy" "lambda_policy" {
  name   = "${var.project_name}-lambda-policy"
  role   = aws_iam_role.lambda_exec.id
  policy = data.aws_iam_policy_document.lambda_policy.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "sqs:SendMessage",
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "s3:PutObject",
      "s3:GetObject"
    ]
    resources = ["*"]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:${var.region}:*:log-group:/aws/lambda/*"]
  }
}

# helper to deploy the zip artifact of a lambda folder
locals {
  lambda_paths = {
    scoring    = "../lambdas/scoring"
    get_result = "../lambdas/get-result"
    report     = "../lambdas/report"
    get_report = "../lambdas/get-report"
  }
}

# package each lambda as a zip file using the archive provider
data "archive_file" "lambda_zips" {
  for_each    = local.lambda_paths
  type        = "zip"
  source_dir  = "${path.module}/${each.value}"
  output_path = "${path.module}/build/${each.key}.zip"
}

# create one aws_lambda_function resource per entry
resource "aws_lambda_function" "functions" {
  for_each = data.archive_file.lambda_zips

  function_name    = "${var.project_name}-${each.key}"
  filename         = each.value.output_path
  source_code_hash = each.value.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = var.lambda_runtime
  timeout          = var.lambda_timeout

  environment {
    variables = {
      DDB_TABLE      = aws_dynamodb_table.results.name
      SQS_QUEUE_URL  = aws_sqs_queue.report_queue.id
      REPORTS_BUCKET = aws_s3_bucket.reports.bucket
    }
  }
}

# déclencheur SQS → Lambda report
resource "aws_lambda_event_source_mapping" "sqs_report_trigger" {
  event_source_arn = aws_sqs_queue.report_queue.arn
  function_name    = aws_lambda_function.functions["report"].arn
  batch_size       = 1
  enabled          = true
}

# ────────────────────────────────────────────────────────────
# API Gateway v1 (REST API) — compatible avec LocalStack free
# ────────────────────────────────────────────────────────────
resource "aws_api_gateway_rest_api" "api" {
  name = "${var.project_name}-api"
}

# /submit
resource "aws_api_gateway_resource" "submit" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "submit"
}

resource "aws_api_gateway_method" "submit_post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.submit.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "submit" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.submit.id
  http_method             = aws_api_gateway_method.submit_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.functions["scoring"].invoke_arn
}

# /result/{id}
resource "aws_api_gateway_resource" "result" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "result"
}

resource "aws_api_gateway_resource" "result_id" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.result.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "result_get" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.result_id.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "result" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.result_id.id
  http_method             = aws_api_gateway_method.result_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.functions["get_result"].invoke_arn
}

# /report/{id}
resource "aws_api_gateway_resource" "report" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "report"
}

resource "aws_api_gateway_resource" "report_id" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.report.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "report_get" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.report_id.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "report" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.report_id.id
  http_method             = aws_api_gateway_method.report_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.functions["get_report"].invoke_arn
}

# déploiement et stage
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  depends_on = [
    aws_api_gateway_integration.submit,
    aws_api_gateway_integration.result,
    aws_api_gateway_integration.report,
  ]
}

resource "aws_api_gateway_stage" "stage" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  deployment_id = aws_api_gateway_deployment.deployment.id
  stage_name    = "dev"
}

# permission to allow API Gateway to invoke lambdas
resource "aws_lambda_permission" "apigw_invoke" {
  for_each = aws_lambda_function.functions

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

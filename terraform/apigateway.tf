resource "aws_apigatewayv2_api" "api" {
  name          = "api"
  protocol_type = "HTTP"
  target = aws_lambda_function.api.arn
  cors_configuration {
    allow_credentials = true
    allow_headers = ["authorization", "content-type", "x-amz-date", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }
}
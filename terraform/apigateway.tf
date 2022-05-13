resource "aws_apigatewayv2_api" "api" {
  name          = aws_lambda_function.api.function_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_credentials = true
    allow_headers     = ["Authorization", "Content-Type"]       # TODO: Read from OpenAPI Schema: Aggregate all Non-Standard with Standard Headers?
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]        # TODO: Read from OpenAPI Schema: Aggregate all used
    allow_origins     = ["https://${aws_s3_bucket.spa.bucket}"] # TODO: Read from OpenAPI Schema: Aggregate expected clients
    max_age           = 3000
  }
}

resource "aws_apigatewayv2_stage" "api" {
  api_id = aws_apigatewayv2_api.api.id

  name        = local.environment
  auto_deploy = true # TODO : Impact of multiple environments?

  # access_log_settings {
  #   destination_arn = aws_cloudwatch_log_group.api_gw.arn

  #   format = jsonencode({
  #     requestId               = "$context.requestId"
  #     sourceIp                = "$context.identity.sourceIp"
  #     requestTime             = "$context.requestTime"
  #     protocol                = "$context.protocol"
  #     httpMethod              = "$context.httpMethod"
  #     resourcePath            = "$context.resourcePath"
  #     routeKey                = "$context.routeKey"
  #     status                  = "$context.status"
  #     responseLength          = "$context.responseLength"
  #     integrationErrorMessage = "$context.integrationErrorMessage"
  #     }
  #   )
  # }
}

resource "aws_apigatewayv2_integration" "api" {
  api_id = aws_apigatewayv2_api.api.id

  integration_uri    = aws_lambda_function.api.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "api" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "ANY /api/{proxy+}" # TODO: Read from OpenAPI Schema Paths.
  target    = "integrations/${aws_apigatewayv2_integration.api.id}"
}

resource "aws_apigatewayv2_route" "root" {
  api_id = aws_apigatewayv2_api.api.id

  route_key = "ANY /api" # TODO: Read from OpenAPI Schema Paths.
  target    = "integrations/${aws_apigatewayv2_integration.api.id}"
}

# resource "aws_cloudwatch_log_group" "api_gw" {
#   name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

#   retention_in_days = 30
# }

resource "aws_apigatewayv2_domain_name" "api" {
  # TODO: Read from Schema Servers?
  domain_name = "api.${local.application}.${local.environment}.${data.aws_route53_zone.tld.name}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2" # TODO: Security Hardening
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.api.id
}

data "archive_file" "api" {
  type        = "zip"
  output_path = "${path.module}/lambda/${local.environment}-${local.application}-api.zip"
  source_dir  = "${path.module}/../api"
  # TODO: Cleanup api (lambda) module.
  excludes = [
    "__tests__",
    ".aws-sam",
    "events",
    "buildspec.yml",
    "Dockerfile",
    "env.json",
    "template.yaml"
  ]
}

resource "aws_s3_object" "api" {
  bucket      = data.aws_s3_bucket.application.bucket
  key         = "lambda/${local.environment}/${local.application}/api.zip"
  source      = data.archive_file.api.output_path
  source_hash = data.archive_file.api.output_base64sha256
}

resource "aws_lambda_function" "api" {
  function_name     = "${local.environment}-${local.application}-api"
  role              = aws_iam_role.api.arn
  s3_bucket         = aws_s3_object.api.bucket
  s3_key            = aws_s3_object.api.key
  s3_object_version = aws_s3_object.api.version_id
  handler           = "src/api/app.handler"
  runtime           = "nodejs14.x"
  timeout           = 30
  package_type      = "Zip"

  environment {
    variables = {
      DYNAMODB_ENDPOINT = "https://dynamodb.${local.region}.amazonaws.com"
    }
  }

  vpc_config {
    subnet_ids         = module.vpc.private_subnets
    security_group_ids = [module.vpc.default_security_group_id]
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = 7
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

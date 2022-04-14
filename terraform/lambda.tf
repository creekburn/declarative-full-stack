resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "api" {
  filename      = null
  s3_bucket     = local.environment == "local" ? "__local__" : null
  s3_key        = local.environment == "local" ? var.LAMBDA_MOUNT_CWD : null
  function_name = "app.handler"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "src/api/app.handler"
  runtime       = "nodejs14.x"
  timeout       = 30
  # source_code_hash = filebase64sha256(var.JAR_PATH)
  # environment {
  #     variables = {
  #         FUNCTION_NAME = "functionOne"
  #     }
  # }
}
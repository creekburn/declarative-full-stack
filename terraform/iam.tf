resource "aws_iam_role" "api" {
  name = "${local.environment}-${local.application}-api-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "api_policy" {
  name        = "api_policy"
  path        = "/"
  description = "IAM policy for api."
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ],
        Effect   = "Allow",
        Resource = [for name, table in aws_dynamodb_table.table : table.arn]
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:${local.region}:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_access" {
  role       = aws_iam_role.api.name
  policy_arn = aws_iam_policy.api_policy.arn
}

# resource "aws_iam_role" "iam_for_cloudfront_logging" {
#   name = "cloudfront-realtime-log-config"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Sid    = ""
#         Principal = {
#           Service = "cloudfront.amazonaws.com"
#         }
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "cloudfront_logging" {
#   name = "cloudfront-realtime-log-config"
#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action = [
#           "kinesis:DescribeStreamSummary",
#           "kinesis:DescribeStream",
#           "kinesis:PutRecord",
#           "kinesis:PutRecords"
#         ],
#         Effect   = "Allow",
#         Resource = aws_kinesis_stream.spa.arn
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "lambda_access" {
#   role       = aws_iam_role.iam_for_cloudfront_logging.name
#   policy_arn = aws_iam_policy.cloudfront_logging.arn
# }

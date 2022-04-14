terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.9.0"
    }
  }

  required_version = "1.1.8"
}

provider "aws" {
  region                      = local.region
  s3_use_path_style           = local.environment != "local"
  skip_credentials_validation = local.environment == "local"
  skip_metadata_api_check     = local.environment == "local"
  skip_requesting_account_id  = local.environment == "local"

  default_tags {
    tags = local.tags
  }

  endpoints {
    apigateway     = local.endpoint
    apigatewayv2   = local.endpoint
    cloudformation = local.endpoint
    cloudwatch     = local.endpoint
    dynamodb       = local.endpoint
    ec2            = local.endpoint
    es             = local.endpoint
    elasticache    = local.endpoint
    firehose       = local.endpoint
    iam            = local.endpoint
    kinesis        = local.endpoint
    lambda         = local.endpoint
    rds            = local.endpoint
    redshift       = local.endpoint
    route53        = local.endpoint
    s3             = local.endpoint
    secretsmanager = local.endpoint
    ses            = local.endpoint
    sns            = local.endpoint
    sqs            = local.endpoint
    ssm            = local.endpoint
    stepfunctions  = local.endpoint
    sts            = local.endpoint
  }
}

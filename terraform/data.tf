data "aws_availability_zones" "available" {
  state = "available"
  filter {
    name   = "opt-in-status"
    values = ["opted-in", "opt-in-not-required"]
  }
  filter {
    name   = "region-name"
    values = [local.region]
  }
}

data "aws_s3_bucket" "application" {
  bucket = "declarative-todo-app"
}

data "aws_route53_zone" "tld" {
  name = local.top_level_domain
}

data "aws_canonical_user_id" "current" {}
data "aws_cloudfront_log_delivery_canonical_user_id" "current" {}
data "aws_region" "current" {}

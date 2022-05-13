terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.13.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.2.0"
    }
  }
  backend "s3" {
    bucket = "declarative-todo-app"
    key    = "terraform"
    region = "us-west-2"
  }
  required_version = "1.1.8"
}

provider "aws" {
  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"

  default_tags {
    tags = merge({}, local.tags, {
      region = "us-east-1"
    })
  }
}

provider "archive" {}

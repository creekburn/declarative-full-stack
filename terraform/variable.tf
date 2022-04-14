variable "region" {
  type = string
  default = "us-west-2"
  description = "AWS Region to Target"
}

variable "local_endpoint" {
  type = string
  default = "http://localhost:4566"
  description = "Endpoint in the local environment to use for aws services."
}

variable "LAMBDA_MOUNT_CWD" {
  type = string
  default = "/c/workspace/todo/lambda"
}
locals {
  environment = terraform.workspace
  region = var.region
  endpoint = local.environment == "local" ? var.local_endpoint : null

  tags = {
    environment = local.environment
    region = local.region
  }

  schema_yaml = file("./app-schema.yaml")
  schema = yamldecode(local.schema_yaml)
}
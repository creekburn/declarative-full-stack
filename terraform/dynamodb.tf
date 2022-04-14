resource "aws_dynamodb_table" "table" {
  for_each = local.schema.components.schemas

  name           = each.value.title
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
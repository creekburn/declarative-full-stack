resource "aws_dynamodb_table" "table" {
  for_each = local.schema.components.schemas

  name           = replace(lower(each.value.title), "/\\s+/", "-") # TODO: look into standard kebab case utility
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

locals {
  environment = terraform.workspace
  region      = data.aws_region.current.name

  top_level_domain = var.top_level_domain

  schema_yaml = file("./app-schema.yaml")
  schema      = yamldecode(local.schema_yaml)

  application = replace(lower(local.schema.info.title), "/\\s+/", "-") # TODO: look into standard kebab case utility

  tags = {
    environment = local.environment
    region      = local.region
    application = local.application
    version     = local.schema.info.version
  }

  # cidr partitioning
  # Goal base_cidr => 
  #     * 1/4 Public Subnet Cidr / az_count
  #     * 3/4 Private Subnet Cidr / az_count
  az_count                 = var.az_count
  az_names                 = slice(data.aws_availability_zones.available.names, 0, local.az_count)
  base_cidr                = var.base_cidr
  private_subnet_base_cidr = cidrsubnets(local.base_cidr, 8, 2)[0]
  private_subnet_cidrs     = cidrsubnets(local.private_subnet_base_cidr, [for name in local.az_names : ceil(log(length(local.az_names), 2))]...)
  public_subnet_base_cidr  = cidrsubnets(local.base_cidr, 8, 2)[1]
  public_subnet_cidrs      = cidrsubnets(local.public_subnet_base_cidr, [for name in local.az_names : ceil(log(length(local.az_names), 2))]...)

  private_subnets = [for index, az_name in local.az_names : {
    region  = local.region
    name    = az_name
    zone_id = data.aws_availability_zones.available.zone_ids[index],
    cidr    = local.private_subnet_cidrs[index]
  }]
  public_subnets = [for index, az_name in local.az_names : {
    region  = local.region
    name    = az_name
    zone_id = data.aws_availability_zones.available.zone_ids[index],
    cidr    = local.public_subnet_cidrs[index]
  }]
}

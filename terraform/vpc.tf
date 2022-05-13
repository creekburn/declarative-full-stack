module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = local.application
  cidr = local.base_cidr

  azs             = [for subnet in local.private_subnets : subnet.name]
  private_subnets = [for subnet in local.private_subnets : subnet.cidr]
  public_subnets  = [for subnet in local.public_subnets : subnet.cidr]

  # One NAT gateway per AZ
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true

  enable_vpn_gateway = true
}

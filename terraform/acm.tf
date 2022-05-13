################### API SSL CERT ###################
resource "aws_acm_certificate" "api" {
  domain_name       = "api.${local.application}.${local.environment}.${data.aws_route53_zone.tld.name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "api_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.tld.zone_id
}

resource "aws_acm_certificate_validation" "api" {
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]
}

################### SPA SSL CERT ###################
resource "aws_acm_certificate" "spa" {
  provider          = aws.us-east-1 // Region required for CloudFront Cert
  domain_name       = "${local.application}.${local.environment}.${data.aws_route53_zone.tld.name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "spa_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.spa.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.tld.zone_id
}

resource "aws_acm_certificate_validation" "spa" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.spa.arn
  validation_record_fqdns = [for record in aws_route53_record.spa_cert_validation : record.fqdn]
}

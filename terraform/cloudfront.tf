resource "aws_cloudfront_origin_access_identity" "spa" {
  comment = "Cloudfront access for [${aws_s3_bucket.spa.bucket}]"
}

data "aws_cloudfront_cache_policy" "default_cache_policy" {
  name = "Managed-CachingOptimized"
}

# data "aws_cloudfront_cache_policy" "default_response_headers_policy" {
#   name = "Managed-CORS-and-SecurityHeadersPolicy"
# }

resource "aws_cloudfront_distribution" "spa" {
  origin {
    domain_name = aws_s3_bucket.spa.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.spa.bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.spa.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "index.html"
  aliases             = [aws_s3_bucket.spa.bucket]

  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.spa.bucket

    cache_policy_id = data.aws_cloudfront_cache_policy.default_cache_policy.id
    # response_headers_policy_id = data.aws_cloudfront_cache_policy.default_response_headers_policy.id

    # forwarded_values {
    #   query_string = false

    #   cookies {
    #     forward = "none"
    #   }
    # }

    viewer_protocol_policy = "redirect-to-https"
    # min_ttl                = 31536000
    # default_ttl            = 31536000
    # max_ttl                = 31536000
    compress = true
  }

  logging_config {
    bucket = aws_s3_bucket.logging.bucket_domain_name
    prefix = "cloudfront/${aws_s3_bucket.spa.bucket}/"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.spa.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}

# resource "aws_cloudfront_realtime_log_config" "spa" {
#   name          = aws_s3_bucket.spa.bucket
#   sampling_rate = 75
#   fields        = ["timestamp", "c-ip", "sc-status", "sc-method", "sc-host", "cs-uri-stem", "time-taken"]

#   endpoint {
#     stream_type = "Kinesis"

#     kinesis_stream_config {
#       role_arn   = aws_iam_role.iam_for_cloudfront_logging.arn
#       stream_arn = aws_kinesis_stream.spa.arn
#     }
#   }

#   depends_on = [aws_iam_role_policy.cloudfront_logging]
# }

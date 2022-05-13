resource "aws_s3_bucket" "logging" {
  bucket = "${local.application}-${local.environment}-logging"

  force_destroy = true
}

resource "aws_s3_bucket_acl" "logging" {
  bucket = aws_s3_bucket.logging.bucket

  access_control_policy {
    grant {
      permission = "READ_ACP"

      grantee {
        type = "Group"
        uri  = "http://acs.amazonaws.com/groups/s3/LogDelivery"
      }
    }

    grant {
      permission = "WRITE"

      grantee {
        type = "Group"
        uri  = "http://acs.amazonaws.com/groups/s3/LogDelivery"
      }
    }

    grant {
      permission = "FULL_CONTROL"

      grantee {
        id   = data.aws_cloudfront_log_delivery_canonical_user_id.current.id
        type = "CanonicalUser"
      }
    }

    grant {
      permission = "FULL_CONTROL"

      grantee {
        id   = data.aws_canonical_user_id.current.id
        type = "CanonicalUser"
      }
    }

    owner {
      id = data.aws_canonical_user_id.current.id
    }
  }
}

resource "aws_s3_bucket_policy" "logging" {
  bucket = aws_s3_bucket.logging.bucket
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "logging.s3.amazonaws.com"
        }
        Action   = "s3:PutObject",
        Resource = "${aws_s3_bucket.logging.arn}/*"
      }
    ]
  })
}


resource "aws_s3_bucket" "spa" {
  bucket = "${local.application}.${local.environment}.${data.aws_route53_zone.tld.name}"
}

resource "aws_s3_bucket_acl" "spa" {
  bucket = aws_s3_bucket.spa.bucket
  access_control_policy {

    grant {
      permission = "READ"

      grantee {
        type = "Group"
        uri  = "http://acs.amazonaws.com/groups/global/AllUsers"
      }
    }

    grant {
      permission = "FULL_CONTROL"

      grantee {
        id   = data.aws_canonical_user_id.current.id
        type = "CanonicalUser"
      }
    }

    owner {
      id = data.aws_canonical_user_id.current.id
    }
  }
}

resource "aws_s3_bucket_policy" "spa" {
  bucket = aws_s3_bucket.spa.bucket
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.spa.iam_arn
        }
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.spa.arn}/*"
      },
      {
        Sid       = "PublicReadGetObject" # TODO: Still needed?
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.spa.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "spa" {
  bucket = aws_s3_bucket.spa.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_cors_configuration" "spa" { # TODO: Test Remove
  bucket = aws_s3_bucket.spa.bucket

  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["https://${local.application}.${local.environment}.${data.aws_route53_zone.tld.name}"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_logging" "spa" {
  bucket = aws_s3_bucket.spa.bucket

  target_bucket = aws_s3_bucket.logging.bucket
  target_prefix = "s3/${aws_s3_bucket.spa.bucket}/"
}

module "spa_files" {
  source  = "hashicorp/dir/template"
  version = "1.0.2"

  base_dir = "${path.module}/../spa/build"
}

resource "aws_s3_object" "spa" {
  for_each = module.spa_files.files

  bucket       = aws_s3_bucket.spa.bucket
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
  etag         = each.value.digests.md5
}

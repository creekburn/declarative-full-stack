# Delarative Terraform
Consume schema from `app-schema.yaml` to create application infrustructure.

## Initalize
Initialize terraform here.

```bash
terraform init
terraform workspace new $ENVIRONMENT
```

### 1. Create AWS Role and configure AWS CLI

TODO: Instructions

### 2. Create terraform backend

```bash
aws s3api create-bucket --bucket "declarative-todo-app" --create-bucket-configuration "LocationConstraint=us-west-2"
aws s3api put-bucket-versioning --bucket "declarative-todo-app" --versioning-configuration "Status=Enabled"
```

### 3. Register Top Level Domain

Follow [guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html) to register domain.

### 4. Run Terraform

```bash
terraform apply -var="top_level_domain=example.com"
```
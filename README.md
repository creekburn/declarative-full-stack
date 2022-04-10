# TODO

## Milestone 1
MVP for basic setup.

### Priority

1. DynamoDB ORM
2. SPA
3. Terraform
4. Actions

### Architecture

* AWS Lambda APIs
* AWS S3 Hosted SPA
* AWS DynamoDB
* Terraform Deployment
* Github Actions CI/CD

* Open API Driven Lambdas
  * Handle Additional Error Types
* Open API ORM
  * Setup DynamoDB Local
  * Implement ORM

* E2E Test from Schema

* Mongo DB - Cuz I'm dumb


### Features

* CRUD TODO objects
  * Due Date
  * Title
  * Description
  * Status
    * Not Started
    * Started
    * On Hold
    * In Progress
    * Done
  * Priority
* TODO Feed - Order by Due Date then Priority, with Status Changer
* Login - All TODO are Authorized to single user for CRUD


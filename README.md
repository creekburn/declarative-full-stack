# TODO

## Milestone 1
MVP for basic setup and POC.

* Application - Everything built from the schema.
* Environment - Running Application.

### Priority

1. DynamoDB ORM
2. SPA
  * Deliver Schema from Backend
  * Create
  * List
  * Edit
  * Delete Buttons
3. Terraform

### Architecture

* Infrastructure
  * AWS Lambda APIs
  * AWS S3 Hosted SPA
  * AWS DynamoDB
  * Terraform Deployment
* API
  * Open API Driven Lambdas
  * Open API ORM for dynamoDB

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

## Milestone 2

### Features

* Testing
  * E2E Test from Schema
  * Unit Testing
* Schemas
  * Schema as npm module
  * Allow Dynamic IDs
  * Dynamically Set OpenAPI Servers
* Login - All TODO are Authorized to single user for CRUD
* Searching
  * Pagination
  * Sort
  * Filters
* SPA
  * Localization
  * Bake Schema into Application
  * Environment Variable Handling
* API
  * Handle Additional Error Types
  * Environment Variable Handling
* Error Design
* Infrastructure
  * Logging
  * Capacity/Scaling Alarms
  * SPA Caching
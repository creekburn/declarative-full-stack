# Declarative Application

The goal is to drive a full stack application from a single schema file.

## Milestone 1

MVP for basic setup and POC.

- Application - Everything built from the schema.
- Environment - Running Application.

### Architecture

- Infrastructure
  - AWS Lambda APIs
  - AWS S3 Hosted SPA
  - AWS DynamoDB
  - Terraform Deployment
- API
  - [AWS SAM](https://aws.amazon.com/serverless/sam/) for Local Development
  - [Open API Driven Lambdas](https://github.com/anttiviljami/openapi-backend)
  - Open API ORM for dynamoDB written using [aws js sdk v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html)
- SPA
  - React
  - Form Generation from [react-jsonschema-form](https://www.npmjs.com/package/@rjsf/core)
  - API Requests made using [openapi-client-axios](https://www.npmjs.com/package/openapi-client-axios)
    - Required heavy modification of webpack 5
  - Basic Styles from [picocss](https://picocss.com/docs/)

### Features

- CRUD TODO objects
  - Due Date
  - Title
  - Description
  - Status
    - Not Started
    - Started
    - On Hold
    - In Progress
    - Done
  - Priority

## Milestone 2

### Features

- Multi-Module
  - `npm install` without simlinks
- Testing
  - E2E Test from Schema
  - Unit Testing
- Schemas
  - Schema as npm module
  - Allow Dynamic IDs
  - Dynamically Set OpenAPI Servers
- Login - All TODO are Authorized to single user for CRUD
- Searching
  - Pagination
  - Sort
  - Filters
- SPA
  - SPA Read - Evaluate Table Components
    - Pagination => Parameters
    - Sort by Column => Parameters
    - Filter by Column => Parameters
  - Integrate bootstrap
  - Localization
  - Bake Schema into Application
  - Environment Variable Handling
  - @rjsf/core declarative configuration and re-use in Create and Update components
- API
  - Development Environment Loading Times
  - Handle Additional Error Types
  - Environment Variable Handling
- Error Design
- Infrastructure
  - Logging
  - Capacity/Scaling Alarms
  - SPA Caching

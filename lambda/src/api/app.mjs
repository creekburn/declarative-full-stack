import YAML from 'yaml';
import { OpenAPIBackend } from 'openapi-backend';
import addFormats from 'ajv-formats';
import _ from 'lodash';
import { URL } from 'url';
import { readFile } from 'fs/promises';
import $RefParser from "@apidevtools/json-schema-ref-parser";

import { register } from './dynamodb-handler.mjs';
import { HEADERS, SCHEMA_OPERATION, methodNotAllowed } from './const.mjs';

const yaml = YAML.parse(await readFile(new URL('./app-schema.yaml', import.meta.url), { encoding: 'utf8' }));
const schema = await $RefParser.dereference(yaml);

// create api with your definition file or object
const api = new OpenAPIBackend({
  definition: schema,
  customizeAjv: (ajv, ajvOpts, validationContext) => {
    addFormats(ajv);
    return ajv;
  }
});

// Schema Endpoint
api.register(SCHEMA_OPERATION, (c, req, res) => ({
  statusCode: 200,
  body: JSON.stringify(schema),
  headers: HEADERS
}));

// Dynamically Register Handlers
register(api, schema);

// Default Handlers
api.register('validationFail', (c, req, res) => ({
  statusCode: 400,
  body: JSON.stringify({ status: 400, errors: c.validation.errors }),
  headers: HEADERS
}));

api.register('methodNotAllowed', (c, req, res) => {
  if (c.request.method === "options") {
    return {
      statusCode: 200,
      headers: HEADERS
    };
  } else {
    return methodNotAllowed(c.request.method);
  }
});

// initalize the backend
api.init();

export const handler = async (event, context) => {
  return api.handleRequest(
    {
      method: event.httpMethod,
      path: event.path,
      query: event.queryStringParameters,
      body: event.body,
      headers: event.headers
    },
    event,
    context
  );
};


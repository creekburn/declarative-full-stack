import _ from 'lodash';
import { v4 } from 'uuid';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ResourceNotFoundException, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { SCHEMA_OPERATION, JSON_MIME_TYPE, ok, internalServerError, notFound, methodNotAllowed } from './const.mjs';

const client = new DynamoDBClient({ endpoint: process.env.DYNAMODB_ENDPOINT });
const docs = DynamoDBDocument.from(client);

const TABLES = {};

export const toTableName = (name) => _.kebabCase(name)

const METHOD_HANDLER = {
  'get': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    if (schema.type === 'array') {
      const result = await docs.scan({
        TableName: toTableName(schema.items.title),
        Select: 'ALL_ATTRIBUTES'
      });
      console.log(`RESULT: ${JSON.stringify(result)}`);
      return ok(result.Items);
    } else {
      const result = await docs.get({
        TableName: toTableName(schema.title),
        Select: 'ALL_ATTRIBUTES',
        Key: {
          id: c.request.params.id
        }
      });
      console.log(`RESULT: ${JSON.stringify(result)}`);
      if (result.Item) {
        return ok(result.Item);
      } else {
        return notFound(c);
      }
    }
  },
  'put': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    const Item = _.merge({}, c.request.requestBody, { id: c.request.params.id })
    try {
      const result = await docs.put({
        TableName: toTableName(schema.title),
        Item,
        ConditionExpression: 'attribute_exists(id) AND id = :id',
        ExpressionAttributeValues: {
          ':id': {
            'S': c.request.params.id
          }
        }
      });
      console.log(`RESULT: ${JSON.stringify(result)}`);
      return ok(Item);
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        console.error(e.message);
        return notFound(c);
      } else {
        throw e;
      }
    }
  },
  'post': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    const Item = _.merge({}, c.request.requestBody, { id: v4() })
    const result = await docs.put({
      TableName: toTableName(schema.title),
      Item
    });
    console.log(`RESULT: ${JSON.stringify(result)}`);
    return ok(Item);
  },
  'delete': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    const result = await docs.delete({
      TableName: toTableName(schema.title),
      ReturnValues: 'ALL_OLD',
      Key: {
        id: c.request.params.id
      }
    });
    console.log(`RESULT: ${JSON.stringify(result)}`);
    return ok(result.Attributes);
  }
};

export const operationHandler = async (c, req, res) => {
  const method = c.operation.method;
  
  if (METHOD_HANDLER[method]) {
    try {
      return METHOD_HANDLER[method](c);
    } catch (e) {
      return internalServerError(e);
    }
  } else {
    return methodNotAllowed(method);
  }
};

export const register = (api, schema) => {
  const operationIds = _.flatMap(schema.paths, (pathItem) => {
    return _.map(_.pickBy(pathItem, (operation) => _.has(operation, 'operationId') && operation.operationId !== SCHEMA_OPERATION), (operation) => {
      let schema = operation.responses['200'].content[JSON_MIME_TYPE].schema;
      if (schema.type === 'array') {
        schema = schema.items;
      }

      // TODO: Enforce schema type: object

      if (!TABLES[schema.title]) {
        TABLES[schema.title] = 'REQUESTED';
        const command = new DescribeTableCommand({
          TableName: toTableName(schema.title)
        });
    
        client.send(command)
          .then(result => {
            console.log('Table Found');
            TABLES[schema.title] = result.Table;
          })
          .catch(err => {
            if (err instanceof ResourceNotFoundException) {
              const input = {
                TableName: toTableName(schema.title),
                BillingMode: 'PAY_PER_REQUEST',
                AttributeDefinitions: [{
                  AttributeName: 'id',
                  AttributeType: 'S'
                }],
                KeySchema: [{
                  AttributeName: 'id',
                  KeyType: 'HASH'
                }]
              };
              console.log(`CREATE TABLE COMMAND INPUT: ${JSON.stringify(input)}`)
              const command = new CreateTableCommand(input);
              return client.send(command)
                .then(result => {
                  TABLES[schema.title] = result.TableDescription;
                })
                .catch(err => {
                  console.error(`Create Table Error: ${err.message}`);
                });
            } else {
              console.error(`Describe Table Error: ${err.message}`);
            }
          });
      }
  
      return operation.operationId;
    })
  });
  api.register(_.merge(..._.map(operationIds, (id) => ({[id]: operationHandler}))));
}
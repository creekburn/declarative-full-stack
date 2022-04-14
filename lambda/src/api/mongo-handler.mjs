import _ from 'lodash';
import mongoose from 'mongoose';
import { createMongooseSchema } from 'convert-json-schema-to-mongoose';
import { HEADERS, JSON_MIME_TYPE } from './const.mjs';

await mongoose.connect(process.env.MONGO_URI);

const MODELS = {};
const getModel = (schema) => {
  if (!MODELS[schema.title]) {
    MODELS[schema.title] = new mongoose.model(schema.title, new mongoose.Schema(createMongooseSchema({}, schema)));
  }
  return MODELS[schema.title];
};

const METHOD_HANDLER = {
  'get': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    if (schema.type === 'array') {
      return getModel(schema.items).find({}).lean();
    } else {
      return getModel(schema).findOne(c.request.params).lean();
    }
  },
  'put': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    return getModel(schema).findOneAndUpdate(c.request.params, c.request.requestBody, { 'new': true, overwrite: true }).lean();
  },
  'post': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    return getModel(schema).create(c.request.requestBody);
  },
  'delete': async (c) => {
    const schema = c.operation.responses['200'].content[JSON_MIME_TYPE].schema;
    return getModel(schema).findOneAndDelete(c.request.params).lean();
  }
};


export const operationHandler = async (c, req, res) => {
  const method = c.operation.method;
  
  if (METHOD_HANDLER[method]) {
    try {
      return {
        statusCode: 200,
        body: JSON.stringify(await METHOD_HANDLER[method](c)),
        headers: HEADERS
      };
    } catch (e) {
      console.error(`ERROR: ${e}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ status: 500, errors: [ { message: e.message } ] }),
        headers: HEADERS
      };
    }
  } else {
    console.error(`ERROR: Request for method [${method}] NOT Implemented.`);
    return {
      statusCode: 405,
      body: JSON.stringify({ status: 405, errors: [ { message: `Method [${method}] NOT Implemented.` } ] }),
      headers: HEADERS
    }
  }
};

export const register = (api, schema) => {
  const operationIds = _.flatMap(schema.paths, (pathItem) => _.map(_.pickBy(pathItem, (operation) => _.has(operation, 'operationId')), (operation) => operation.operationId));
  api.register(_.merge(..._.map(operationIds, (id) => ({[id]: operationHandler}))));
}
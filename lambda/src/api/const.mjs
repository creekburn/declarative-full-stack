export const JSON_MIME_TYPE = 'application/json';
export const HEADERS = {
  'Content-Type': JSON_MIME_TYPE,
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*'
};

export const SCHEMA_OPERATION = 'apiGetSchema';

export const ok = (body) => ({
  statusCode: 200,
  body: JSON.stringify(body),
  headers: HEADERS
});

export const notFound = (c) => {
  const message = `NOT FOUND :: ${c.request.method.toUpperCase()} ${c.request.path}`;
  console.error(message);
  return {
    statusCode: 404,
    body: JSON.stringify({ status: 404, errors: [ { message } ] }),
    headers: HEADERS
  };
};

export const methodNotAllowed = (method) => {
  console.error(`Request for method [${method}] NOT Implemented.`);
  return {
    statusCode: 405,
    body: JSON.stringify({ status: 405, errors: [ { message: `Method [${method}] NOT Implemented.` } ] }),
    headers: HEADERS
  };
};

export const internalServerError = (e) => {
  console.error(e.message);
  return {
    statusCode: 500,
    body: JSON.stringify({ status: 500, errors: [ { message: e.message } ] }),
    headers: HEADERS
  };
};
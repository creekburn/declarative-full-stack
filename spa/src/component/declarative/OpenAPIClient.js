import OpenAPIClientAxios from 'openapi-client-axios';
import _ from 'lodash';

export const init = _.memoize(async (schema) => {
  if (_.isEmpty(schema)) {
    throw new Error(`Invalid Schema:\n${JSON.stringify(schema, null, 2)}`);
  }
  const api = new OpenAPIClientAxios({definition: schema});
  const client = await api.init();
  return {
    api,
    client
  };
});

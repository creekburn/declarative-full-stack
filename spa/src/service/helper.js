import _ from 'lodash';

export const getOperation = (schema, operationId) => {
  const paths = (schema && schema.paths) || {};
  for (const pathPart of _.keys(paths)) {
    const path = paths[pathPart];
    for (const method of _.keys(path)) {
      const operation = path[method];
      if (operation.operationId === operationId) {
        return {
          method,
          ...operation
        };
      }
    }
  }
};
import { useEffect, useState } from 'react';
import Form from '@rjsf/core';
import OpenAPIClientAxios from 'openapi-client-axios';
import _ from 'lodash';

import { getOperation } from './helper';

function Create({schema, operation}) {
  const [client, setClient] = useState();
  
  useEffect(() => {
    const api = new OpenAPIClientAxios({definition: schema});
    api.init().then(setClient);
  }, [schema]);

  const onSubmit = async ({formData}, e) => {
    const response = await client[operation]({}, formData, {});
    console.log(response);
  };

  if (!_.isEmpty(schema) && client) {
    return (
      <Form schema={_.get(getOperation(schema, operation), ['requestBody', 'content', 'application/json', 'schema'])} 
        onSubmit={onSubmit} />
    );
  } else {
    return (<div>
      Pending Operation Information
    </div>);
  }
}

export default Create;

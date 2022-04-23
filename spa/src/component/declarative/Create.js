import Form from '@rjsf/core';
import _ from 'lodash';

import { init } from '../../service/OpenAPIClient';
import { getOperation } from '../../service/helper';

function Create({
  schema,
  operation,
  onCreate = () => { },
  onCancel = () => { }
}) {

  const handleSubmit = async ({ formData }, e) => {
    const { client } = await init(schema);
    const response = await client[operation]([], formData, {});
    onCreate(response.data);
  };

  if (!_.isEmpty(schema)) {
    return (
      <Form schema={_.get(getOperation(schema, operation), ['requestBody', 'content', 'application/json', 'schema'])}
        onSubmit={handleSubmit} >
        <div className="grid">
          <button type="submit">Submit</button>
          <button type="reset" onClick={onCancel}>Cancel</button>
        </div>
      </Form>
    );
  } else {
    return (<p className="center" aria-busy="true">Schema Required</p>);
  }
}

export default Create;

import { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import _ from 'lodash';
import { useParams, Link } from 'react-router-dom';

import { init } from '../../service/OpenAPIClient';
import { getOperation } from '../../service/helper';

import Delete from './Delete';

function Update({
  schema,
  get,
  update,
  onUpdate = () => { },
  onCancel = () => { }
}) {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  // TODO: Dynamic Parameter generation?
  const parameters = [{ name: 'id', value: params.id, in: 'path' }];

  useEffect(() => {
    if (!_.isEmpty(schema)) {
      getData();
    }
  }, [schema]);

  const getData = async (force = false) => {
    if (_.isEmpty(schema)) {
      console.error(new Error('Cannot load data from empty schema.'));
    } else {
      if (!isLoading || force) {
        setIsLoading(true);
        init(schema)
          .then(res => res.client)
          .then(client => {
            return client[get](parameters, null, {})
              .catch(error => {
                return error.response;
              });
          })
          .then((response) => {
            setIsLoading(false);
            if (response.status === 200) {
              setData(response.data);
            } else {
              return Promise.reject(response.data);
            }
          })
          .catch(console.error); // TODO: Replace with error display
      }
    }
  }

  const handleSubmit = async ({ formData }, e) => {
    const { client } = await init(schema);
    const response = await client[update](parameters, formData, {});
    onUpdate(response.data);
  };

  const whileLoadingSchema = () => {
    if (_.isEmpty(schema)) {
      return (<p className="center" aria-busy="true">Loading Schema</p>);
    } else {
      return whileLoadingData();
    }
  }

  const whileLoadingData = () => {
    if (isLoading) {
      return (<p className="center" aria-busy="true">Loading Data</p>);
    } else {
      return (
        <Form schema={_.get(getOperation(schema, update), ['requestBody', 'content', 'application/json', 'schema'])}
          formData={data}
          onSubmit={handleSubmit} >
          <div className="grid">
            <button type="submit">Submit</button>
            <button type="reset" onClick={onCancel}>Cancel</button>
            {/* TODO: How to obtain operationId? */}
            <Delete schema={schema} id={data.id} operation="apiDeleteTodo" onDelete={onCancel} />
          </div>
        </Form>
      );
    }
  }

  return (
    <>
      {whileLoadingSchema()}
    </>
  );
}

export default Update;

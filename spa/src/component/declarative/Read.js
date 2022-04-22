import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { init } from './OpenAPIClient';
import { getOperation } from './helper';

function Read({
  schema,
  operation
}, ref) {
  const [isLoading, setIsLoading] = useState(false);
  const [parameters, setParameters] = useState([{ name: 'page', value: 1, in: 'query' }]);
  const [data, setData] = useState([]);


  useImperativeHandle(ref, () => ({
    reload: () => {
      getData(true);
    }
  }));

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
            return client[operation](parameters, null, {})
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

  const whileLoadingSchema = () => {
    if (_.isEmpty(schema)) {
      return (<p className="center" aria-busy="true">Loading Schema</p>);
    } else {
      const itemSchema = _.get(getOperation(schema, operation), ['responses', '200', 'content', 'application/json', 'schema', 'items']);
      const headers = _.sortBy(_.keys(_.omit(itemSchema.properties, ['id'])));
      // TODO: Add Pagination
      return (<table>
        <thead>
          <tr>
            {_.map(headers, (header) => <th key={header}>{header}</th>)}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {whileLoadingData(headers)}
        </tbody>
      </table>);
    }
  }

  const whileLoadingData = (headers) => {
    if (isLoading) {
      return (<tr>
        <td className="center" aria-busy="true" colSpan="100%">Loading Data</td>
      </tr>);
    } else {
      return _.map(data, (item) => (
        <tr key={item.id}>
          {_.map(headers, (name) => <td key={name}>{item[name]}</td>)}
          <td>
            <Link to={item.id}>
              <button>Edit</button>
            </Link>
          </td>
        </tr>
      ));
    }
  }

  return (
    <>
      {whileLoadingSchema()}
    </>
  );
}

export default forwardRef(Read);
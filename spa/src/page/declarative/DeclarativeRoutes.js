import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Create from '../../component/declarative/Create';
import Read from '../../component/declarative/Read';
import Update from '../../component/declarative/Update';

function DeclarativeRoutes({ schemaURL }) {
  const navigate = useNavigate();
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [schema, setSchema] = useState({});

  useEffect(() => {
    setSchemaLoading(true);
    fetch(schemaURL)
      .then(response => response.json())
      .then(schema => {
        setSchema(schema);
        setSchemaLoading(false);
      });
  }, [schemaURL]);

  const navigateToIndex = () => {
    navigate('');
  }

  const whileLoading = () => {
    if (schemaLoading) {
      return <p className="center" aria-busy="true">Loading Schema</p>;
    } else {
      // TODO: How to obtain operationIds?
      return (<Routes>
        <Route index element={<Read schema={schema} operation="apiGetTodos" />} />
        <Route path="new" element={<Create schema={schema} operation="apiCreateTodo" onCreate={navigateToIndex} onCancel={navigateToIndex} />} />
        <Route path=":id" element={<Update schema={schema} get="apiGetTodo" update="apiPutTodo" onUpdate={navigateToIndex} onCancel={navigateToIndex} />} />
      </Routes>);
    }
  };

  return (<main className="container">
    <div className="grid center">
      <Link to=""><button>List</button></Link>
      <Link to="new"><button>Create</button></Link>
    </div>
    {whileLoading()}
  </main>);
}

export default DeclarativeRoutes;

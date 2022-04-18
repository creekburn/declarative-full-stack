import { useEffect, useState } from 'react';
import _ from 'lodash';

import Create from './Create';

function DeclarativeUI({schemaURL, createOperation}) {
  const [schema, setSchema] = useState({});

  useEffect(() => {
    fetch(schemaURL)
      .then(response => response.json())
      .then(setSchema);
  }, [schemaURL]);

  return (
    <main class="container">
      <section>
        <h1>Declarative UI</h1>
      </section>
      <section>
        <Create schema={schema} operation={createOperation} />
      </section>
      <section>
        <pre>
          {JSON.stringify(schema, null, 2)}
        </pre>
      </section>
    </main>
  );
}

export default DeclarativeUI;

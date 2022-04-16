import { useEffect, useState } from 'react';

function DeclarativeUI({schemaURL}) {
  const [schema, setSchema] = useState({});

  useEffect(() => {
    fetch(schemaURL)
      .then(response => response.json())
      .then(setSchema);
  }, [schemaURL])

  return (
    <main>
      <h1>Declarative UI</h1>
      <pre>
        {JSON.stringify(schema, null, 2)}
      </pre>
    </main>
  );
}

export default DeclarativeUI;

import { init } from '../../service/OpenAPIClient';

function Delete({ schema, id, operation, onDelete = () => {} }) {
  // TODO: Dynamic Parameter generation?
  const parameters = [{ name: 'id', value: id, in: 'path' }];

  const handleDelete = async (event) => {
    const { client } = await init(schema);
    const response = await client[operation](parameters, null, {});
    onDelete(response.data);
  };

  return (
    <button className="btn-danger" onClick={handleDelete}>
      Delete
    </button>
  );
}

export default Delete;

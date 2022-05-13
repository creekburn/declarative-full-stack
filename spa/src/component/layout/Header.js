import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">
              <strong>Declarative App</strong>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/todo">TODO</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

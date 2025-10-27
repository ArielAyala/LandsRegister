import { Link, useNavigate } from 'react-router-dom';
import { logout, getToken } from '../auth';

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  function onLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <Link to="/properties">Properties</Link>
      {token ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

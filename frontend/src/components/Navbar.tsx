import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getToken } from "../auth";

function isActivePath(current: string, path: string) {
  if (path === "/") return current === path;
  return current.startsWith(path);
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <Link to="/" className="app-navbar__brand">
          LandRegister
        </Link>
        <nav className="app-navbar__links">
          <Link
            to="/"
            className={`nav-link ${isActivePath(location.pathname, "/") ? "nav-link--active" : ""}`.trim()}
          >
            Inicio
          </Link>
          <Link
            to="/properties"
            className={`nav-link ${isActivePath(location.pathname, "/properties") ? "nav-link--active" : ""}`.trim()}
          >
            Propiedades
          </Link>
          {token ? (
            <button className="button-secondary" onClick={onLogout} type="button">
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Iniciar sesión
              </Link>
              <Link to="/register" className="button-primary">
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

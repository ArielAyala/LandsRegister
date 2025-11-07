import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getToken } from "../auth";
import { useState, useEffect } from "react";
import "./Navbar.css";

function isActivePath(current: string, path: string) {
  if (path === "/") return current === path;
  return current.startsWith(path);
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function onLogout() {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <Link to="/" className="app-navbar__brand">
          LandRegister
        </Link>

        {/* Menú desktop */}
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

        {/* Botón hamburguesa para móvil */}
        <button
          className={`app-navbar__hamburger ${isMobileMenuOpen ? "app-navbar__hamburger--open" : ""}`}
          onClick={toggleMobileMenu}
          type="button"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="app-navbar__overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Menú móvil - Sidebar lateral */}
      <nav className={`app-navbar__mobile ${isMobileMenuOpen ? "app-navbar__mobile--open" : ""}`}>
        <div className="app-navbar__mobile-header">
          <span className="app-navbar__mobile-brand">LandRegister</span>
          <button
            className="app-navbar__close"
            onClick={closeMobileMenu}
            type="button"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="app-navbar__mobile-links">
          <Link
            to="/"
            className={`nav-link-mobile ${isActivePath(location.pathname, "/") ? "nav-link-mobile--active" : ""}`.trim()}
          >
            Inicio
          </Link>
          <Link
            to="/properties"
            className={`nav-link-mobile ${isActivePath(location.pathname, "/properties") ? "nav-link-mobile--active" : ""}`.trim()}
          >
            Propiedades
          </Link>
          {token ? (
            <button className="button-secondary button-mobile" onClick={onLogout} type="button">
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-link-mobile">
                Iniciar sesión
              </Link>
              <Link to="/register" className="button-primary button-mobile">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

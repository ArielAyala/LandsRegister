import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import PropertiesList from "./pages/PropertiesList";
import PropertyForm from "./pages/PropertyForm";
import PropertyDetails from "./pages/PropertyDetails";

export default function App() {
  const location = useLocation();
  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-shell">
      {!isAuthRoute && <Navbar />}
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <section className="hero-card">
                  <span className="pill">Land Registry Hub</span>
                  <div className="hero-card__content">
                    <h1 className="heading-primary">
                      Bienvenido a tu panel de propiedades
                    </h1>
                    <p className="text-muted">
                      Gestiona lotes, vendedores y documentación desde una
                      interfaz moderna diseñada para tu flujo de trabajo diario.
                    </p>
                    <div className="hero-actions">
                      <Link className="button-primary" to="/properties">
                        Ver listado
                      </Link>
                      <Link className="button-secondary" to="/properties/new">
                        Registrar propiedad
                      </Link>
                    </div>
                  </div>
                </section>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <PropertiesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/new"
            element={
              <ProtectedRoute>
                <PropertyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedRoute>
                <PropertyDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id/edit"
            element={
              <ProtectedRoute>
                <PropertyForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

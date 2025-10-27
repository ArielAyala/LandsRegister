import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message ?? "No se pudo iniciar sesión.";
  }
  return "No se pudo iniciar sesión.";
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username.trim(), password);
      navigate("/properties");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <div>
        <h2>Bienvenido de nuevo</h2>
        <p className="text-muted">
          Ingresa con tus credenciales para continuar gestionando propiedades.
        </p>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="input-field">
          <label htmlFor="login-username">Usuario</label>
          <input
            id="login-username"
            placeholder="Ej. jlopez"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="form-actions">
          <Link className="link-inline" to="/register">
            ¿No tienes cuenta? Regístrate
          </Link>
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </div>
      </form>
    </section>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../auth";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message ?? "No se pudo crear la cuenta.";
  }
  return "No se pudo crear la cuenta.";
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(username.trim(), email.trim(), password);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <div>
        <h2>Crea tu cuenta</h2>
        <p className="text-muted">
          Configura un usuario para administrar el registro de propiedades.
        </p>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="input-field">
          <label htmlFor="register-username">Usuario</label>
          <input
            id="register-username"
            placeholder="Ej. rrios"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            type="email"
            placeholder="nombre@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            placeholder="Elige una contraseña segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="form-actions">
          <Link className="link-inline" to="/login">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </section>
  );
}

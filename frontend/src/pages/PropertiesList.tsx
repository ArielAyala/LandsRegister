import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import type { Property } from "../types";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Property[]>("/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la propiedad");
    }
  }

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="card-surface">
          <div className="skeleton skeleton--sm" />
          <div className="skeleton skeleton--lg" />
          <div className="skeleton skeleton--md" />
        </div>
      );
    }

    if (!properties.length) {
      return (
        <div className="card-surface empty-state">
          No hay propiedades registradas aún. Usa el botón «Registrar propiedad»
          para comenzar.
        </div>
      );
    }

    return (
      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Precio</th>
                <th>Contacto vendedor</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id}>
                  <td>
                    <Link className="link-inline" to={`/properties/${prop.id}`}>
                      {prop.reference}
                    </Link>
                  </td>
                  <td>{currencyFormatter.format(prop.price)}</td>
                  <td>{prop.sellerContact}</td>
                  <td>{prop.user}</td>
                  <td>
                    <span className="badge">
                      {prop.isTitled ? "Titulado" : "Sin título"}
                    </span>
                  </td>
                  <td>
                    <div className="property-actions">
                      <Link
                        className="nav-link"
                        to={`/properties/${prop.id}/edit`}
                      >
                        Editar
                      </Link>
                      <button onClick={() => onDelete(prop.id)} type="button">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }, [loading, properties]);

  return (
    <section className="surface-section">
      <header className="page-header">
        <div>
          <h2 className="heading-section">Propiedades registradas</h2>
          <p className="text-muted">
            Consulta, edita o elimina propiedades del registro.
          </p>
        </div>
        <Link className="button-primary" to="/properties/new">
          Registrar propiedad
        </Link>
      </header>
      {content}
    </section>
  );
}

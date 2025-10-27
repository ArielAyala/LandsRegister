import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import type { Property } from "../types";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<Property>(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const coordinates = useMemo(() => {
    if (!property) return "-";
    if (property.latitude == null || property.longitude == null)
      return "Sin coordenadas";
    return `${property.latitude.toFixed(6)}, ${property.longitude.toFixed(6)}`;
  }, [property]);

  if (loading || !property) {
    return (
      <section className="surface-section">
        <div className="card-surface">
          <div className="skeleton skeleton--lg" />
          <div className="skeleton skeleton--sm" />
          <div className="skeleton" />
        </div>
      </section>
    );
  }

  return (
    <section className="surface-section">
      <header className="page-header">
        <div>
          <span className="pill">Referencia {property.reference}</span>
          <h2 className="heading-section">Detalle de propiedad</h2>
          <p className="text-muted">
            Información consolidada para seguimiento y verificación.
          </p>
        </div>
        <Link
          className="button-secondary"
          to={`/properties/${property.id}/edit`}
        >
          Editar propiedad
        </Link>
      </header>

      <div className="card-surface">
        <div className="details-grid">
          <div className="detail-tile">
            <span>Precio estimado</span>
            <strong>{currencyFormatter.format(property.price)}</strong>
          </div>
          <div className="detail-tile">
            <span>Estado del título</span>
            <strong>{property.isTitled ? "Titulado" : "Sin título"}</strong>
          </div>
          <div className="detail-tile">
            <span>Responsable</span>
            <strong>{property.user}</strong>
          </div>
          <div className="detail-tile">
            <span>Contacto del vendedor</span>
            <strong>{property.sellerContact}</strong>
          </div>
          <div className="detail-tile">
            <span>Dimensiones</span>
            <strong>{property.dimensions}</strong>
          </div>
          <div className="detail-tile">
            <span>Coordenadas</span>
            <strong>{coordinates}</strong>
          </div>
        </div>

        {property.locationLink && (
          <a
            className="button-secondary"
            href={property.locationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver ubicación en mapa
          </a>
        )}
      </div>
    </section>
  );
}

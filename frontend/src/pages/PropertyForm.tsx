import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { CreateProperty, Property } from "../types";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message ?? "No se pudo guardar la propiedad.";
  }
  return "No se pudo guardar la propiedad.";
}

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [model, setModel] = useState<CreateProperty>({
    reference: "",
    sellerContact: "",
    price: 0,
    locationLink: undefined,
    latitude: undefined,
    longitude: undefined,
    dimensions: "",
    isTitled: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoadingProperty(true);
    api
      .get<Property>(`/properties/${id}`)
      .then((res) => {
        const p = res.data;
        setModel({
          reference: p.reference,
          sellerContact: p.sellerContact,
          price: p.price,
          locationLink: p.locationLink ?? undefined,
          latitude: p.latitude ?? undefined,
          longitude: p.longitude ?? undefined,
          dimensions: p.dimensions,
          isTitled: p.isTitled,
        });
      })
      .catch((err) => setFormError(getErrorMessage(err)))
      .finally(() => setLoadingProperty(false));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (isEdit && id) {
        await api.put(`/properties/${id}`, model);
      } else {
        await api.post("/properties", model);
      }
      navigate("/properties");
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    navigate(-1);
  }

  function updateModel<K extends keyof CreateProperty>(
    key: K,
    value: CreateProperty[K]
  ) {
    setModel((current) => ({ ...current, [key]: value }));
  }

  if (loadingProperty) {
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
          <h2 className="heading-section">
            {isEdit ? "Editar propiedad" : "Registrar nueva propiedad"}
          </h2>
          <p className="text-muted">
            Completa la información clave para mantener actualizado el registro.
          </p>
        </div>
      </header>

      <form className="card-surface form-grid two-columns" onSubmit={onSubmit}>
        {formError && (
          <div className="alert-error form-span-full">{formError}</div>
        )}

        <div className="input-field">
          <label htmlFor="property-reference">Referencia</label>
          <input
            id="property-reference"
            placeholder="Ej. LOTE-001"
            value={model.reference}
            onChange={(e) => updateModel("reference", e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <label htmlFor="property-seller">Contacto del vendedor</label>
          <input
            id="property-seller"
            placeholder="Nombre o teléfono"
            value={model.sellerContact}
            onChange={(e) => updateModel("sellerContact", e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <label htmlFor="property-price">Precio estimado</label>
          <input
            id="property-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 150000"
            value={model.price === 0 ? "" : model.price}
            onChange={(e) => updateModel("price", Number(e.target.value) || 0)}
            required
          />
        </div>

        {/* Owner is assigned by the server from the authenticated user. No input required. */}

        <div className="input-field">
          <label htmlFor="property-location">
            Enlace de ubicación (opcional)
          </label>
          <input
            id="property-location"
            placeholder="https://maps.google.com/..."
            value={model.locationLink ?? ""}
            onChange={(e) =>
              updateModel("locationLink", e.target.value || undefined)
            }
          />
        </div>

        <div className="input-field">
          <label htmlFor="property-dimensions">Dimensiones</label>
          <input
            id="property-dimensions"
            placeholder="Ej. 25m x 40m"
            value={model.dimensions}
            onChange={(e) => updateModel("dimensions", e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <label htmlFor="property-latitude">Latitud</label>
          <input
            id="property-latitude"
            type="number"
            placeholder="Ej. -12.0464"
            value={model.latitude ?? ""}
            onChange={(e) =>
              updateModel(
                "latitude",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>

        <div className="input-field">
          <label htmlFor="property-longitude">Longitud</label>
          <input
            id="property-longitude"
            type="number"
            placeholder="Ej. -77.0428"
            value={model.longitude ?? ""}
            onChange={(e) =>
              updateModel(
                "longitude",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>

        <label className="form-checkbox form-span-full">
          <input
            type="checkbox"
            checked={model.isTitled}
            onChange={(e) => updateModel("isTitled", e.target.checked)}
          />
          La propiedad cuenta con título inscrito
        </label>

        <div className="form-actions form-span-full">
          <button className="button-secondary" onClick={onCancel} type="button">
            Cancelar
          </button>
          <button className="button-primary" type="submit" disabled={saving}>
            {saving
              ? "Guardando..."
              : isEdit
              ? "Guardar cambios"
              : "Registrar propiedad"}
          </button>
        </div>
      </form>
    </section>
  );
}

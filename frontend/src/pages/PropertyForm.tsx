import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { CreateProperty, Property } from "../types";

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
    user: "",
  });

  useEffect(() => {
    if (!id) return;
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
          user: p.user,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await api.put(`/properties/${id}`, model);
      } else {
        await api.post("/properties", model);
      }
      navigate("/properties");
    } catch (err: any) {
      console.error(err);
      alert("Save failed");
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>{isEdit ? "Edit" : "Create"} Property</h2>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 480,
        }}
      >
        <input
          placeholder="Reference"
          value={model.reference}
          onChange={(e) => setModel({ ...model, reference: e.target.value })}
        />
        <input
          placeholder="Seller contact"
          value={model.sellerContact}
          onChange={(e) =>
            setModel({ ...model, sellerContact: e.target.value })
          }
        />
        <input
          placeholder="Price"
          type="number"
          value={model.price}
          onChange={(e) =>
            setModel({ ...model, price: Number(e.target.value) })
          }
        />
        <input
          placeholder="Location link"
          value={model.locationLink ?? ""}
          onChange={(e) => setModel({ ...model, locationLink: e.target.value })}
        />
        <input
          placeholder="Latitude"
          type="number"
          value={model.latitude ?? ""}
          onChange={(e) =>
            setModel({
              ...model,
              latitude: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <input
          placeholder="Longitude"
          type="number"
          value={model.longitude ?? ""}
          onChange={(e) =>
            setModel({
              ...model,
              longitude: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <input
          placeholder="Dimensions"
          value={model.dimensions}
          onChange={(e) => setModel({ ...model, dimensions: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={model.isTitled}
            onChange={(e) => setModel({ ...model, isTitled: e.target.checked })}
          />{" "}
          Is titled
        </label>
        <input
          placeholder="User"
          value={model.user}
          onChange={(e) => setModel({ ...model, user: e.target.value })}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

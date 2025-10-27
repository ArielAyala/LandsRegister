import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import type { Property } from "../types";

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  if (loading) return <div style={{ padding: 12 }}>Loading...</div>;

  return (
    <div style={{ padding: 12 }}>
      <h2>Properties</h2>
      <Link to="/properties/new">Create new</Link>
      <table
        style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Reference</th>
            <th>Price</th>
            <th>Seller</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => (
            <tr key={prop.id} style={{ borderTop: "1px solid #eee" }}>
              <td>
                <Link to={`/properties/${prop.id}`}>{prop.reference}</Link>
              </td>
              <td>{prop.price}</td>
              <td>{prop.sellerContact}</td>
              <td>{prop.user}</td>
              <td>
                <Link to={`/properties/${prop.id}/edit`}>Edit</Link>
                {" | "}
                <button onClick={() => onDelete(prop.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

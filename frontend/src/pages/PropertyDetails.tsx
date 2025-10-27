import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import type { Property } from '../types';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Property>(`/properties/${id}`).then((res) => setProperty(res.data)).catch((err) => console.error(err));
  }, [id]);

  if (!property) return <div style={{ padding: 12 }}>Loading...</div>;

  return (
    <div style={{ padding: 12 }}>
      <h2>{property.reference}</h2>
      <div>Price: {property.price}</div>
      <div>Seller: {property.sellerContact}</div>
      <div>User: {property.user}</div>
      <div>Dimensions: {property.dimensions}</div>
      <div>Is Titled: {property.isTitled ? 'Yes' : 'No'}</div>
      {property.locationLink && <div><a href={property.locationLink} target="_blank">Location</a></div>}
      <div style={{ marginTop: 12 }}>
        <Link to={`/properties/${property.id}/edit`}>Edit</Link>
      </div>
    </div>
  );
}

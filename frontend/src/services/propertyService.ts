import api from '../api';
import type { Property, CreateProperty } from '../types';

export async function getProperties(): Promise<Property[]> {
  const res = await api.get<Property[]>('/properties');
  return res.data;
}

export async function getProperty(id: string): Promise<Property> {
  const res = await api.get<Property>(`/properties/${id}`);
  return res.data;
}

export async function createProperty(property: CreateProperty): Promise<Property> {
  const res = await api.post<Property>('/properties', property);
  return res.data;
}

export async function updateProperty(id: string, property: CreateProperty): Promise<Property> {
  const res = await api.put<Property>(`/properties/${id}`, property);
  return res.data;
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
}
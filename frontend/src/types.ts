export interface Property {
  id: string;
  reference: string;
  sellerContact: string;
  price: number;
  locationLink?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  dimensions: string;
  isTitled: boolean;
  registrationDate: string;
  user: string;
}

export interface CreateProperty {
  reference: string;
  sellerContact: string;
  price: number;
  locationLink?: string;
  latitude?: number;
  longitude?: number;
  dimensions: string;
  isTitled: boolean;
  user: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

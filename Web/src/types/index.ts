export interface User {
  id: number;
  name?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  photo_url?: string | null;
  role_id: number;
  client_id?: number | null;
  partner_id?: number | null;
  permissions: string[];
  role_name: string;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface User {
  id: number;
  name?: string | null;
  email: string;
  role_id: number;
  client_id?: number | null;
  partner_id?: number | null;
  permissions: string[];
  role_name: string;
  token?: string;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    role_id: number;
    client_id?: number;
    partner_id?: number;
    permissions?: string[];
  };
}


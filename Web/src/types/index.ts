export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  ok: boolean;
  user?: User;
  message?: string;
}

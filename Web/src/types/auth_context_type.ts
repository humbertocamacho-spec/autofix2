import type { User } from "../types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  reloadUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}
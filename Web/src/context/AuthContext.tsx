// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

export interface User {
  id: number;
  name?: string | null;
  email: string;
  role_id: number;
  client_id?: number | null;
  partner_id?: number | null;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  ready: boolean;               // 🔹 indica que el contexto ya cargó user/token
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Logout
  const logout = useCallback(() => {
    console.log("[AuthContext] logout");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  // Cargar usuario desde token
  const loadUserFromToken = useCallback(async (tok?: string) => {
    const actualToken = tok || token;
    if (!actualToken) {
      logout();
      return;
    }

    try {
      console.log("[AuthContext] loadUserFromToken called, token:", actualToken);
      const data = await api.me(actualToken);
      console.log("[AuthContext] Respuesta cruda de /me:", data);

      if (data?.ok && data?.user) {
        const u = data.user;
        setUser({
          id: u.id,
          name: u.name || null,
          email: u.email,
          role_id: u.role_id,
          client_id: u.client_id ?? null,
          partner_id: u.partner_id ?? null,
          permissions: u.permissions || [],
        });
        console.log("[AuthContext] setting user:", u);
      } else {
        logout();
      }
    } catch (err) {
      console.error("[AuthContext] Error loadUserFromToken:", err);
      logout();
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, [logout, token]);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(email, password);
      console.log("[AuthContext] Respuesta cruda de login:", response);
      if (!response?.token) return false;

      localStorage.setItem("token", response.token);
      setToken(response.token);
      setLoading(true);
      await loadUserFromToken(response.token); // 🔹 asegurar user actualizado
      return true;
    } catch (err) {
      console.error("[AuthContext] Error login:", err);
      return false;
    }
  };

  // Reload user
  const reloadUser = async () => {
    setLoading(true);
    await loadUserFromToken();
  };

  // Al iniciar app
  useEffect(() => {
    const init = async () => {
      if (token) {
        await loadUserFromToken(token);
      } else {
        setLoading(false);
        setReady(true);
      }
    };
    init();
  }, [token, loadUserFromToken]);

  return (
    <AuthContext.Provider value={{ user, token, loading, ready, login, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};

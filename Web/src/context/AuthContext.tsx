import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

export interface User {
  id: number;
  name?: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = async () => {
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const data = await api.me(token);
    console.log("Respuesta de /me:", data);

    // TU BACKEND DEVUELVE EL USER DIRECTO → no data.user
    if (data && data.id && data.role_id) {
      setUser(data);  // ← ASÍ DIRECTO
    } else {
      console.log("Formato de user inválido");
      logout();
    }
  } catch (err) {
    console.error("Error en /me:", err);
    logout();
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadUserFromToken();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await api.login(email, password);

    if (!response.token) {
      return false;
    }

    localStorage.setItem("token", response.token);
    setToken(response.token);
    // QUITA ESTO: setUser(response.user);
    // Deja que /me lo cargue correctamente

    return true;
  } catch (err) {
    return false;
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};
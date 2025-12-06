import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
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

      if (data?.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);

      if (!data?.token) return false;

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);

      return true;
    } catch {
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
  if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};

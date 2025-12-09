import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;  
  ready: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  reloadUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
    setReady(false);
  }, []);

  const loadUserFromToken = useCallback(
    async (tok?: string) => {
      const actualToken = tok ?? token;
      if (!actualToken) {
        setUser(null);
        setLoading(false);
        setReady(true);
        return false;
      }

      try {
        setLoading(true);
        const data = await api.me(actualToken);

        if (data?.user) {
          setUser({
            id: data.user.id,
            name: data.user.name ?? null,
            email: data.user.email,
            role_id: data.user.role_id,
            client_id: data.user.client_id ?? null,
            partner_id: data.user.partner_id ?? null,
            permissions: data.user.permissions ?? [],
          });
          setLoading(false);
          setReady(true);
          return true;
        } else {
          logout();
          return false;
        }
      } catch (err) {
        logout();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, logout]
  );

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.login(email, password);

      if (!response || !response.token) {
        setLoading(false);
        return false;
      }

      localStorage.setItem("token", response.token);
      setToken(response.token);

      const ok = await loadUserFromToken(response.token);
      setLoading(false);
      return ok;
    } catch (err) {
      setLoading(false);
      return false;
    }
  };

  const reloadUser = async () => {
    setLoading(true);
    await loadUserFromToken();
    setLoading(false);
  };

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  useEffect(() => {
    (async () => {
      if (token) {
        await loadUserFromToken(token);
      } else {
        setUser(null);
        setLoading(false);
        setReady(true);
      }
    })();
  }, [token, loadUserFromToken]);

  return (
    <AuthContext.Provider value={{ user, token, loading, ready, login, logout, reloadUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "../types";
import type { AuthContextType } from "../types/auth_context_type";

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
            phone: data.user.phone ?? null,
            address: data.user.address ?? null,
            photo_url: data.user.photo_url ?? null,
            role_id: data.user.role_id,
            role_name: data.user.role_name,
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await api.login(email, password);

      if (!response?.ok) {
        return {
          ok: false,
          message: response?.message || "Error al iniciar sesión",
        };
      }

      localStorage.setItem("token", response.token);
      setToken(response.token);

      const ok = await loadUserFromToken(response.token);

      if (!ok) {
        return {
          ok: false,
          message: "No se pudo cargar el usuario",
        };
      }

      return { ok: true };
    } catch (err: any) {
      return {
        ok: false,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Error de conexión con el servidor",
      };
    } finally {
      setLoading(false);
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
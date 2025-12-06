import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Cargando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

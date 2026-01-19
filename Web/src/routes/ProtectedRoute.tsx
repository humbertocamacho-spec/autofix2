import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../types/protected_route";

// Route that checks if the user is logged in and has the required permission
export default function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { user, loading, ready, hasPermission } = useAuthContext();

  if (!ready || loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

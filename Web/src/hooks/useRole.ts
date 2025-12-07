// hooks/useRole.ts
import { useAuthContext } from "../context/AuthContext";

export const useRole = () => {
  const { user } = useAuthContext();
  
  const isAdmin = user?.role_id === 1;
  const isPartner = user?.role_id === 2;
  const isClient = user?.role_id === 3;

  return { isAdmin, isPartner, isClient, role_id: user?.role_id };
};
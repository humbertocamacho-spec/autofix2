import { useAuthContext } from "../context/AuthContext";

export const usePermission = () => {
  const { user } = useAuthContext();

  const hasPermission = (perm: string) => {
    if (!user) return false;
    return user.permissions.includes(perm);
  };

  return { hasPermission };
};

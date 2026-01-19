import { useAuthContext } from "../context/AuthContext";

// Hook to check if the user has a specific permission
export const usePermission = () => {
  const { user } = useAuthContext();

  const can = (perm: string) => {
    if (!user) return false;
    return user.permissions.includes(perm);
  };

  return { can };
};

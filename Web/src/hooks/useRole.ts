import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";

export const useRole = () => {
  const { user } = useAuthContext();

  const roleFlags = useMemo(() => {
    const flags = {
      isAdmin: user?.role_id === 1,
      isPartner: user?.role_id === 2,
      isClient: user?.role_id === 3,
    };
    console.log("[useRole] user changed, flags:", flags);
    return flags;
  }, [user?.role_id]);

  return roleFlags;
};

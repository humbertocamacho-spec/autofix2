import { useAuthContext } from "../context/AuthContext";
import type { Props } from "../types/props_check";

// Check permission component
export const CheckPermission = ({ permission, children }: Props) => {
  const { hasPermission } = useAuthContext();
  if (!hasPermission(permission)) return null;
  return <>{children}</>;
};

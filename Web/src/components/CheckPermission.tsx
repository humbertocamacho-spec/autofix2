import type { ReactNode } from "react";
import { useAuthContext } from "../context/AuthContext";

interface Props {
  permission: string;
  children: ReactNode;
}

export const CheckPermission = ({ permission, children }: Props) => {
  const { hasPermission } = useAuthContext();
  if (!hasPermission(permission)) return null;
  return <>{children}</>;
};

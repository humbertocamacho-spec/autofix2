import type { ReactNode } from "react";
import { useAuthContext } from "../context/AuthContext";

interface Props {
  permission: string;
  children: ReactNode;
}

export const CheckPermission = ({ permission, children }: Props) => {
  const { user } = useAuthContext();
  if (!user) return null;
  if (!user.permissions.includes(permission)) return null;
  return <>{children}</>;
};

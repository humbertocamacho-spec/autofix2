import type { ReactNode } from "react";
import { usePermission } from "../hooks/usePermission";

interface CanProps {
  permission: string | string[];
  children: ReactNode;
}

export default function Can({ permission, children }: CanProps) {
  const { can } = usePermission();

  if (Array.isArray(permission)) {
    return permission.some((p) => can(p)) ? <>{children}</> : null;
  }

  return can(permission) ? <>{children}</> : null;
}

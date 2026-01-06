import { usePermission } from "../hooks/usePermission";
import type { CanProps } from "../types/can_props";

// Can component
export default function Can({ permission, children }: CanProps) {
  const { can } = usePermission();

  if (Array.isArray(permission)) {
    return permission.some((p) => can(p)) ? <>{children}</> : null;
  }

  return can(permission) ? <>{children}</> : null;
}

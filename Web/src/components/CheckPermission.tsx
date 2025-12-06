import type { ReactNode } from "react";
import { usePermission } from "../hooks/usePermission";

const CheckPermission = ({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) return null;

  return <>{children}</>;
};

export default CheckPermission;

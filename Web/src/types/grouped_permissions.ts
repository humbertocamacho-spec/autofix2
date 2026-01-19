import type { Permission } from "../types/permission";

export interface GroupedPermissions {
  [moduleId: number]: Permission[];
}
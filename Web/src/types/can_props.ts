import type { ReactNode } from "react";

export interface CanProps {
  permission: string | string[];
  children: ReactNode;
}
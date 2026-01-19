import type { ReactNode } from "react";

export interface Props {
  children: ReactNode;
  number?: string | number;
  label?: string;
  iconPath?: string;
  iconColor?: string;
}

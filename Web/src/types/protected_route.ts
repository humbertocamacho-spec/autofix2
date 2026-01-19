import type { JSX } from "react";

export interface ProtectedRouteProps {
  children: JSX.Element;
  permission?: string;
}
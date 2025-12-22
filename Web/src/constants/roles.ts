export const ROLES = {
  ADMIN: "admin",
  PARTNER: "partner",
  CLIENT: "client",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

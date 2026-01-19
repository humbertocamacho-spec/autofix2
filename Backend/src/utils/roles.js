import pool from "../config/db.js";

// Roles constants
export const ROLES = Object.freeze({
  ADMIN: "admin",
  PARTNER: "partner",
  CLIENT: "client",
});

const roleCache = {};

// Get role id by name
export async function getRoleId(roleName) {
  if (roleCache[roleName]) return roleCache[roleName];

  const [rows] = await pool.query( "SELECT id FROM roles WHERE name = ?", [roleName]);

  if (rows.length === 0) {
    throw new Error(`Rol "${roleName}" no existe`);
  }

  roleCache[roleName] = rows[0].id;
  return rows[0].id;
}
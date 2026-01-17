import express from "express";
import db from "@/config/db.js";
import { authMiddleware } from "@/middlewares/authMiddleware.js";

const router = express.Router();

// Endpoint to get all roles
router.get("/",authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM roles ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ ok: false, message: "Error al obtener roles" });
  }
});

// Endpoint to create a role
router.get("/:roleId/permissions",authMiddleware, async (req, res) => {
  const { roleId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT permission_id FROM roles_permissions WHERE role_id = ?",
      [roleId]
    );

    res.json({ ok: true, permissions: rows.map(r => r.permission_id)});

  } catch (error) {
    console.error("Error al obtener permisos del rol:", error);
    res.status(500).json({ ok: false, message: "Error al obtener permisos del rol" });
  }
});

// Endpoint to create a role
router.post("/:roleId/permissions",authMiddleware, async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  if (!Array.isArray(permissions)) {
    return res.status(400).json({ ok: false, message: "Formato inválido" });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.query( "DELETE FROM roles_permissions WHERE role_id = ?", [roleId]);

    for (const perm of permissions) {
      await connection.query(
        "INSERT INTO roles_permissions (role_id, permission_id) VALUES (?, ?)",
        [roleId, perm]
      );
    }

    await connection.commit();
    res.json({ ok: true, message: "Permisos actualizados correctamente" });

  } catch (error) {
    console.error("Error al guardar permisos:", error);
    if (connection) await connection.rollback();

    res.status(500).json({ ok: false, message: "Error al guardar permisos" });

  } finally {
    if (connection) connection.release();
  }
});

// Endpoint to delete a role
router.put("/update-role",authMiddleware, async (req, res) => {
  let connection;

  try {
    const { userId, newRoleId } = req.body;

    if (!userId || !newRoleId) {
      return res.status(400).json({ ok: false, message: "Faltan datos" });
    }

    connection = await db.getConnection();

    const [rows] = await connection.query(
      "SELECT role_id FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    const oldRoleId = rows[0].role_id;

    if (oldRoleId === newRoleId) {
      connection.release();
      return res.json({ ok: true, message: "El rol es el mismo, no se realizaron cambios" });
    }

    await connection.beginTransaction();

    if (oldRoleId === 3)
      await connection.query("DELETE FROM clients WHERE user_id = ?", [userId]);

    if (oldRoleId === 2)
      await connection.query("DELETE FROM partners WHERE user_id = ?", [userId]);

    if (oldRoleId === 1)
      await connection.query("DELETE FROM admins WHERE user_id = ?", [userId]);

    if (newRoleId === 3)
      await connection.query("INSERT INTO clients (user_id) VALUES (?)", [userId]);

    if (newRoleId === 2)
      await connection.query("INSERT INTO partners (user_id) VALUES (?)", [userId]);

    if (newRoleId === 1)
      await connection.query("INSERT INTO admins (user_id) VALUES (?)", [userId]);

    await connection.query( "UPDATE users SET role_id = ? WHERE id = ?", [newRoleId, userId]);
    await connection.commit();

    res.json({ ok: true, message: "Rol actualizado exitosamente" });

  } catch (error) {
    console.error(error);

    if (connection) await connection.rollback();
    res.status(500).json({ ok: false, message: "Error al actualizar rol" });

  } finally {
    if (connection) connection.release();
  }
});

export default router;

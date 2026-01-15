import express from "express";
import pool from "../config/db.js";
import { ROLES, getRoleId } from "../utils/roles.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get admins
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [admins] = await pool.query(`
      SELECT 
        a.id,
        a.user_id,
        u.name AS user_name
      FROM admins a
      LEFT JOIN users u ON u.id = a.user_id
    `);

    res.json({ ok: true, admins });
  } catch (error) {
    console.error("Error al obtener admins:", error);
    res.status(500).json({ ok: false, message: "Error al obtener admins" });
  }
});

// Create admin
router.post("/", authMiddleware, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ ok: false, message: "user_id es requerido" });
    }

    await connection.beginTransaction();

    const adminRoleId = await getRoleId(ROLES.ADMIN);

    await connection.query( "UPDATE users SET role_id = ? WHERE id = ?", [adminRoleId, user_id]);

    const [[exists]] = await connection.query( "SELECT id FROM admins WHERE user_id = ?", [user_id]);

    if (!exists) {
      await connection.query(
        "INSERT INTO admins (user_id) VALUES (?)",
        [user_id]
      );
    }

    await connection.commit();

    res.json({ ok: true, message: "Admin creado correctamente"});

  } catch (error) {
    await connection.rollback();
    console.error("Error al crear admin:", error);
    res.status(500).json({ ok: false, message: "Error al crear admin" });
  } finally {
    connection.release();
  }
});

// Update admin
router.put("/:id", authMiddleware, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ ok: false, message: "user_id es requerido" });
    }

    await connection.beginTransaction();

    const [[oldAdmin]] = await connection.query( "SELECT user_id FROM admins WHERE id = ?", [id]);

    if (!oldAdmin) {
      await connection.rollback();
      return res.status(404).json({ ok: false, message: "Admin no encontrado" });
    }

    const adminRoleId = await getRoleId(ROLES.ADMIN);
    const clientRoleId = await getRoleId(ROLES.CLIENT);

    await connection.query( "UPDATE admins SET user_id = ? WHERE id = ?", [user_id, id]);

    await connection.query( "UPDATE users SET role_id = ? WHERE id = ?", [clientRoleId, oldAdmin.user_id]);

    await connection.query( "UPDATE users SET role_id = ? WHERE id = ?", [adminRoleId, user_id]);

    await connection.commit();

    res.json({ ok: true, message: "Admin actualizado correctamente"});

  } catch (error) {
    await connection.rollback();
    console.error("Error al actualizar admin:", error);
    res.status(500).json({ ok: false, message: "Error al actualizar admin" });
  } finally {
    connection.release();
  }
});

// Delete admin
router.delete("/:id", authMiddleware, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [[admin]] = await connection.query( "SELECT user_id FROM admins WHERE id = ?", [id]);

    if (!admin) { await connection.rollback(); return res.status(404).json({ ok: false, message: "Admin no encontrado" });}

    const clientRoleId = await getRoleId(ROLES.CLIENT);

    await connection.query(
      "UPDATE users SET role_id = ? WHERE id = ?",
      [clientRoleId, admin.user_id]
    );

    await connection.query( "DELETE FROM admins WHERE id = ?", [id]);

    await connection.commit();

    res.json({ ok: true, message: "Admin eliminado y rol cambiado a client correctamente"});

  } catch (error) {
    await connection.rollback();
    console.error("Error al eliminar admin:", error);
    res.status(500).json({ ok: false, message: "Error al eliminar admin" });
  } finally {
    connection.release();
  }
});

export default router;

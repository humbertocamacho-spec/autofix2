import express from "express";
import db from "../config/db.js";
import { ROLES, getRoleId } from "../utils/roles.js";

const router = express.Router();

//Get users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.role_id,
        u.photo_url,
        u.gender_id,
        u.deleted_at,
        r.name AS role_name,
        g.name AS gender_name
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      LEFT JOIN genders g ON g.id = u.gender_id
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      role_id,
      gender_id,
      photo_url
    } = req.body;

    await connection.beginTransaction();

    const [[user]] = await connection.query("SELECT id, role_id FROM users WHERE id = ?", [id]);

    if (!user) {
      await connection.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const adminRoleId = await getRoleId(ROLES.ADMIN);

    await connection.query(
      `
      UPDATE users
      SET 
        name = ?,
        email = ?,
        phone = ?,
        address = ?,
        role_id = ?,
        gender_id = ?,
        photo_url = ?
      WHERE id = ?
      `,
      [name, email, phone, address, role_id, gender_id, photo_url, id]
    );

    if (Number(role_id) === Number(adminRoleId)) {
      const [[exists]] = await connection.query(
        "SELECT id FROM admins WHERE user_id = ?",
        [id]
      );

      if (!exists) {
        await connection.query(
          "INSERT INTO admins (user_id) VALUES (?)",
          [id]
        );
      }
    }
    else {
      await connection.query(
        "DELETE FROM admins WHERE user_id = ?",
        [id]
      );
    }

    await connection.commit();

    res.json({ ok: true, message: "Usuario actualizado y rol sincronizado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error actualizando usuario" });
  } finally {
    connection.release();
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE users SET deleted_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await db.query(`
      UPDATE tickets t
      JOIN clients c ON c.id = t.client_id
      SET t.deleted_at = NOW()
      WHERE c.user_id = ?
        AND t.deleted_at IS NULL
    `, [id]);


    res.json({
      ok: true,
      message: "Usuario desactivado correctamente"
    });

  } catch (error) {
    console.error("Error soft deleting user:", error);
    res.status(500).json({ message: "Error desactivando usuario" });
  }
});

// Restore user
router.patch("/:id/restore", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE users SET deleted_at = NULL WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await db.query(`
      UPDATE tickets t
      JOIN clients c ON c.id = t.client_id
      SET t.deleted_at = NULL
      WHERE c.user_id = ?
    `, [id]);
    
    res.json({
      ok: true,
      message: "Usuario reactivado correctamente"
    });

  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ message: "Error reactivando usuario" });
  }
});

export default router;

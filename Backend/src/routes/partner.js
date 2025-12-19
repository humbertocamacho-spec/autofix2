import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.get("/select", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name
      FROM partners
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener partners para select:", error);
    res.status(500).json({ message: "Error al obtener partners" });
  }
});

// Mapa de la app (Visible para todos)
router.get("/map", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        whatsapp,
        phone,
        location,
        latitude,
        longitude,
        logo_url,
        description,
        priority
      FROM partners
      WHERE deleted_at IS NULL
      ORDER BY priority ASC, name ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error mapa partners:", error);
    res.status(500).json({ message: "Error al obtener partners" });
  }
});

// Tabla de Partners por usuario (Web)
router.get("/", authMiddleware, async (req, res) => {
  try {

    const { user_id, role_id } = req.user;

    const [roleRow] = await db.query(
      "SELECT name FROM roles WHERE id = ?",
      [role_id]
    );

    const roleName = roleRow[0]?.name?.toLowerCase();

    let sql = `
      SELECT 
        p.id,
        p.name,
        p.user_id,
        p.whatsapp,
        p.phone,
        p.location,
        p.latitude,
        p.longitude,
        p.land_use_permit,
        p.scanner_handling,
        p.logo_url,
        p.description,
        p.priority,
        p.deleted_at
      FROM partners p
      JOIN users u ON p.user_id = u.id
    `;

    const params = [];

    if (roleName === "partner") {
      sql += " WHERE p.user_id = ?";
      params.push(user_id);
    }

    sql += " ORDER BY p.priority ASC, p.name ASC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los partners:", error);
    res.status(500).json({ message: "Error al obtener los partners" });
  }
});

router.post("/", async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      name,
      user_id,
      whatsapp,
      phone,
      location,
      latitude,
      longitude,
      land_use_permit,
      scanner_handling,
      logo_url,
      description,
      priority,
      speciality_ids
    } = req.body;

    await connection.beginTransaction();

    //Crear partner
    const [result] = await connection.query(`
      INSERT INTO partners 
      (name, user_id, whatsapp, phone, location, latitude, longitude, land_use_permit, scanner_handling, logo_url, description, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name,
        user_id,
        whatsapp,
        phone,
        location,
        latitude,
        longitude,
        land_use_permit,
        scanner_handling,
        logo_url,
        description,
        priority
      ]
    );

    const partnerId = result.insertId;
    if (Array.isArray(speciality_ids) && speciality_ids.length > 0) {
      const values = speciality_ids.map(id => [partnerId, id]);

      await connection.query(
        `
        INSERT INTO partners_specialities (partner_id, speciality_id)
        VALUES ?
        `,
        [values]
      );
    }

    // Confirmar transacción
    await connection.commit();

    res.json({
      message: "Partner creado correctamente",
      id: partnerId
    });

  } catch (error) {
    await connection.rollback();
    console.error("Error creando partner:", error);
    res.status(500).json({ message: "Error al crear partner" });
  } finally {
    connection.release();
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      user_id,
      whatsapp,
      phone,
      location,
      latitude,
      longitude,
      land_use_permit,
      scanner_handling,
      logo_url,
      description,
      priority
    } = req.body;

    const sql = `
      UPDATE partners SET
        name = ?, 
        user_id = ?, 
        whatsapp = ?, 
        phone = ?, 
        location = ?, 
        latitude = ?, 
        longitude = ?, 
        land_use_permit = ?, 
        scanner_handling = ?, 
        logo_url = ?, 
        description = ?, 
        priority = ?
      WHERE id = ?
    `;

    await db.query(sql, [
      name,
      user_id,
      whatsapp,
      phone,
      location,
      latitude,
      longitude,
      land_use_permit,
      scanner_handling,
      logo_url,
      description,
      priority,
      id
    ]);

    res.json({ message: "Partner actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar partner:", error);
    res.status(500).json({ message: "Error al actualizar partner" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE partners SET deleted_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Partner no encontrado" });
    }

    res.json({
      ok: true,
      message: "Partner desactivado correctamente"
    });

  } catch (error) {
    console.error("Error soft deleting partner:", error);
    res.status(500).json({ message: "Error desactivando partner" });
  }
});

router.patch("/:id/restore", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE partners SET deleted_at = NULL WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Partner no encontrado" });
    }

    res.json({
      ok: true,
      message: "Partner reactivado correctamente"
    });

  } catch (error) {
    console.error("Error restoring partner:", error);
    res.status(500).json({ message: "Error reactivando partner" });
  }
});



export default router;
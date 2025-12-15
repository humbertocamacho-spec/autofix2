import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.get("/select", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name
      FROM partners
      ORDER BY name ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener partners para select:", error);
    res.status(500).json({ message: "Error al obtener partners" });
  }
});

router.get("/",authMiddleware, async (req, res) => {
  try {
    console.log(req.user);

    const { user_id, role_id } = req.user;

    let sql = `
      SELECT 
        p.id,
        p.name,
        p.whatsapp,
        p.phone,
        p.location,
        p.latitude,
        p.longitude,
        p.land_use_permit,
        p.scanner_handling,
        p.logo_url,
        p.description,
        p.priority
      FROM partners p
      JOIN users u ON p.user_id = u.id
    `;

   const params = [];

    if (role_id === "partner") {
      sql += ` WHERE p.user_id = ?`;
      params.push(user_id);
    }

    sql += ` ORDER BY p.priority ASC, p.name ASC`;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los partners:", error);
    res.status(500).json({ message: "Error al obtener los partners" });
  }
});

router.post("/", async (req, res) => {
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
      priority
    } = req.body;

    const sql = `
      INSERT INTO partners 
      (name, user_id, whatsapp, phone, location, latitude, longitude, land_use_permit, scanner_handling, logo_url, description, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      priority
    ]);

    res.json({ message: "Partner creado correctamente" });
  } catch (error) {
    console.error("Error al crear partner:", error);
    res.status(500).json({ message: "Error al crear partner" });
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

    await db.query("DELETE FROM partners WHERE id = ?", [id]);

    res.json({ message: "Partner eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar partner:", error);
    res.status(500).json({ message: "Error al eliminar partner" });
  }
});

export default router;
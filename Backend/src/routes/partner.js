import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
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
      ORDER BY p.priority ASC, p.name ASC;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los partners:", error);
    res.status(500).json({ message: "Error al obtener los partners" });
  }
});

export default router;

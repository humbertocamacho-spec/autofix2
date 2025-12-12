import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { partner_id } = req.query;
    if (!partner_id) return res.status(400).json({ message: "partner_id es requerido" });

    const [rows] = await db.query(
      `
      SELECT 
        pc.id,
        pc.partner_id,
        pc.certification_id,
        c.name AS certification_name
      FROM partners_certifications pc
      INNER JOIN certifications c
        ON pc.certification_id = c.id
      WHERE pc.partner_id = ?
      `,
      [partner_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener las certificaciones:", error);
    res.status(500).json({ message: "Error al obtener las certificaciones" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.id AS partner_id,
        p.name AS partner_name,
        c.name AS certification_name
      FROM partners p
      LEFT JOIN partners_certifications pc
        ON p.id = pc.partner_id
      LEFT JOIN certifications c
        ON pc.certification_id = c.id
      ORDER BY p.id
      `
    );

    const partnersMap = new Map();

    rows.forEach(row => {
      if (!partnersMap.has(row.partner_id)) {
        partnersMap.set(row.partner_id, {
          id: row.partner_id,
          name: row.partner_name,
          certifications: [],
        });
      }
      if (row.certification_name) {
        partnersMap.get(row.partner_id).certifications.push(row.certification_name);
      }
    });

    res.json(Array.from(partnersMap.values()));
  } catch (error) {
    console.error("Error al obtener partners con certificaciones:", error);
    res.status(500).json({ message: "Error al obtener partners con certificaciones" });
  }
});

export default router;

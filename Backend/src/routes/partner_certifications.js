import express from "express";
import db from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const { partner_id } = req.query;

    if (!partner_id) {
      return res.status(400).json({ message: "partner_id es requerido" });
    }

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


export default router;
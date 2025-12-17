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
      INNER JOIN certifications c ON pc.certification_id = c.id
      WHERE pc.partner_id = ?
      `,
      [partner_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las certificaciones" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        pc.id,
        pc.partner_id,
        pc.certification_id,
        p.name AS partner_name,
        c.name AS certification_name
      FROM partners_certifications pc
      INNER JOIN partners p ON pc.partner_id = p.id
      INNER JOIN certifications c ON pc.certification_id = c.id
      ORDER BY pc.id ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener certificaciones" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { partner_id, certification_id } = req.body;
    const [result] = await db.query(
      "INSERT INTO partners_certifications (partner_id, certification_id) VALUES (?, ?)",
      [partner_id, certification_id]
    );
    res.json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al crear certificación" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id, certification_id } = req.body;
    await db.query(
      "UPDATE partners_certifications SET partner_id=?, certification_id=? WHERE id=?",
      [partner_id, certification_id, id]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al actualizar certificación" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM partners_certifications WHERE id=?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al eliminar certificación" });
  }
});

export default router;

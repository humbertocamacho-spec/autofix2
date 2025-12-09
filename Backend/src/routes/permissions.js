import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [permissions] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.module_id,
        m.name AS module_name,
        p.function_id,
        f.name AS function_name
      FROM permissions p
      JOIN modules m ON p.module_id = m.id
      JOIN functions f ON p.function_id = f.id
      ORDER BY p.module_id, p.function_id
    `);

    res.json(permissions);

  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ ok: false, message: "Error fetching permissions" });
  }
});

export default router;

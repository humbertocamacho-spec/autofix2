import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [permissions] = await pool.query(
      "SELECT id, name, module_id FROM permissions"
    );

    res.json({ ok: true, permissions });
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({ ok: false, message: "Error al obtener permisos" });
  }
});

export default router;

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM modules");
    res.json({ modules: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, description FROM modules");
    res.json({ modules: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, message: "Name is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO modules (name, description)
       VALUES (?, ?)`,
      [name, description || null]
    );

    res.json({
      ok: true,
      message: "Module created",
      id: result.insertId,
    });

  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ ok: false, message: "Error creating module" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, message: "Name is required" });
    }

    const [result] = await pool.query(
      `UPDATE modules
       SET name = ?, description = ?
       WHERE id = ?`,
      [name, description || null, id]
    );

    res.json({
      ok: true,
      message: "Module updated",
      affectedRows: result.affectedRows,
    });

  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ ok: false, message: "Error updating module" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM modules WHERE id = ?`,
      [id]
    );

    res.json({
      ok: true,
      message: "Module deleted",
      affectedRows: result.affectedRows,
    });

  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ ok: false, message: "Error deleting module" });
  }
});

export default router;

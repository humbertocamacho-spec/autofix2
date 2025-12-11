import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, description FROM modules ORDER BY id ASC");
    res.json({ modules: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO modules (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res.json({
      message: "Module created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ error: "Error creating module" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE modules SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json({ message: "Module updated successfully" });
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ error: "Error updating module" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM modules WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ error: "Error deleting module" });
  }
});

export default router;

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
router.post("/", async (req, res) => {
  try {
    const { name, module_id } = req.body;

    if (!name || !module_id) {
      return res.status(400).json({ ok: false, error: "Faltan campos" });
    }

    await pool.query(
      "INSERT INTO permissions (name, module_id) VALUES (?, ?)",
      [name, module_id]
    );

    res.json({ ok: true, message: "Permiso creado" });
  } catch (error) {
    console.error("Error al crear permiso:", error);
    res.status(500).json({ ok: false, message: "Error al crear permiso" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, module_id } = req.body;

    await pool.query(
      "UPDATE permissions SET name = ?, module_id = ? WHERE id = ?",
      [name, module_id, id]
    );

    res.json({ ok: true, message: "Permiso actualizado" });
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    res.status(500).json({ ok: false, message: "Error al actualizar permiso" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM permissions WHERE id = ?", [id]);

    res.json({ ok: true, message: "Permiso eliminado" });
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    res.status(500).json({ ok: false, message: "Error al eliminar permiso" });
  }
});

export default router;

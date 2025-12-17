import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.id,
                c.user_id,
                u.name AS user_name
            FROM clients c
            LEFT JOIN users u ON u.id = c.user_id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener clients:", error);
        res.status(500).json({ message: "Error al obtener clients" });
    }
});

router.post("/", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id)
      return res.status(400).json({ message: "user_id es requerido" });

    await db.query(
      "INSERT INTO clients (user_id) VALUES (?)",
      [user_id]
    );

    res.json({ message: "Cliente creado correctamente" });
  } catch (error) {
    console.error("Error al crear client:", error);
    res.status(500).json({ message: "Error al crear client" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    await db.query(
      "UPDATE clients SET user_id = ? WHERE id = ?",
      [user_id, id]
    );

    res.json({ message: "Cliente actualizado" });
  } catch (error) {
    console.error("Error al actualizar client:", error);
    res.status(500).json({ message: "Error al actualizar client" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM clients WHERE id = ?", [id]);

    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar client:", error);
    res.status(500).json({ message: "Error al eliminar client" });
  }
});

export default router;

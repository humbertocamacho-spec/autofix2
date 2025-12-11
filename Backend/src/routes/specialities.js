import express from "express";
import db from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT 
            id, name
        FROM specialities
    `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las specialities:", error);
        res.status(500).json({ message: "Error al obtener las specialities" });
    }
});

router.post("/", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO specialities (name) VALUES (?)",
            [name]
        );

        res.json({
            ok: true,
            id: result.insertId,
            message: "Especialidad creada correctamente",
        });
    } catch (error) {
        console.error("Error al crear specialitie:", error);
        res.status(500).json({ message: "Error al crear specialitie" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    try {
        await db.query(
            "UPDATE specialities SET name = ? WHERE id = ?",
            [name, id]
        );

        res.json({ ok: true, message: "Especialidad actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar specialitie:", error);
        res.status(500).json({ message: "Error al actualizar specialitie" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM specialities WHERE id = ?", [id]);
        res.json({ ok: true, message: "Especialidad eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar specialitie:", error);
        res.status(500).json({ message: "Error al eliminar specialitie" });
    }
});

export default router;
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Endpoint to get all specialities
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

// Endpoint to create a speciality
router.post("/", async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO specialities (name) VALUES (?)`,
            [name]
        );

        res.json({  message: "Especialidad creada", id: result.insertId
        });

    } catch (error) {
        console.error("Error al crear especialidad:", error);
        res.status(500).json({ message: "Error al crear especialidad" });
    }
});

// Endpoint to get a speciality by id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    try {
        const [result] = await db.query(
            `UPDATE specialities SET name = ? WHERE id = ?`,
            [name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Especialidad no encontrada" });
        }

        res.json({ message: "Especialidad actualizada" });

    } catch (error) {
        console.error("Error al actualizar especialidad:", error);
        res.status(500).json({ message: "Error al actualizar especialidad" });
    }
});

// Endpoint to delete a speciality by id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            `DELETE FROM specialities WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Especialidad no encontrada" });
        }

        res.json({ message: "Especialidad eliminada" });

    } catch (error) {
        console.error("Error al eliminar especialidad:", error);
        res.status(500).json({ message: "Error al eliminar especialidad" });
    }
});

export default router;
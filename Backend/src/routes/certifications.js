import express from "express";
import pool from "@/config/db.js";
import { authMiddleware } from "@/middlewares/authMiddleware.js";

const router = express.Router();

// Endpoint to get all certifications
router.get("/", authMiddleware, async (req, res) => {
    try {
        const [certifications] = await pool.query(
            "SELECT id,name FROM certifications"
        );

        res.json({ ok: true, certifications });
    } catch (error) {
        console.error("Error al obtener certificaciones:", error);
        res.status(500).json({ ok: false, message: "Error al obtener certificaciones" });
    }
});

// Endpoint to create a certification
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
        }

        await pool.query(
            "INSERT INTO certifications (name) VALUES (?)",
            [name]
        );

        res.json({ ok: true, message: "Certificación creada correctamente" });
    } catch (error) {
        console.error("Error al crear certificación:", error);
        res.status(500).json({ ok: false, message: "Error al crear certificación" });
    }
});

// Endpoint to get a certification by id
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        await pool.query(
            "UPDATE certifications SET name = ? WHERE id = ?",
            [name, id]
        );

        res.json({ ok: true, message: "Certificación actualizada" });
    } catch (error) {
        console.error("Error al actualizar certificación:", error);
        res.status(500).json({ ok: false, message: "Error al actualizar certificación" });
    }
});

// Endpoint to delete a certification by id
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM certifications WHERE id = ?", [id]);

        res.json({ ok: true, message: "Certificación eliminada" });
    } catch (error) {
        console.error("Error al eliminar certificación:", error);
        res.status(500).json({ ok: false, message: "Error al eliminar certificación" });
    }
});

export default router;

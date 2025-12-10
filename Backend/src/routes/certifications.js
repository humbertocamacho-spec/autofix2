import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
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

export default router;

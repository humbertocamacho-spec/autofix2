import express from "express";
import pool from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [admins] = await pool.query(
            "SELECT id, user_id FROM admins"
        );

        res.json({ ok: true, admins });
    } catch (error) {
        console.error("Error al obtener admins:", error);
        res.status(500).json({ ok: false, message: "Error al obtener admins" });
    }
});

export default router;

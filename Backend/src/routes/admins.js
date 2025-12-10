import express from "express";
import pool from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [admins] = await pool.query(`
            SELECT 
                a.id, 
                a.user_id,
                u.name AS user_name
            FROM admins a
            LEFT JOIN users u ON u.id = a.user_id
            `);

        res.json({ ok: true, admins });
    } catch (error) {
        console.error("Error al obtener admins:", error);
        res.status(500).json({ ok: false, message: "Error al obtener admins" });
    }
});

export default router;

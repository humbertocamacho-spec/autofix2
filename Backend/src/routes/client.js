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

export default router;

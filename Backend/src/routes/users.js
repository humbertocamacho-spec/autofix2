import express from "express";
import db from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.role_id,
        u.photo_url,
        u.gender_id,
        r.name AS role_name,
        g.name AS gender_name
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      LEFT JOIN genders g ON g.id = u.gender_id
    `);

        res.json(rows);

    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        res.status(500).json({ message: "Error obteniendo usuarios" });
    }
});

export default router;

import express from "express";
import db from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT 
                ps.id, 
                ps.partner_id, 
                ps.speciality_id
            FROM partners_specialities AS ps
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las specialities:", error);
        res.status(500).json({ message: "Error al obtener las specialities" });
    }
});

router.get("/partner/:partnerId", async (req, res) => {
    const { partnerId } = req.params;

    const [rows] = await db.query(`
    SELECT speciality_id
    FROM partners_specialities
    WHERE partner_id = ?
  `, [partnerId]);

    res.json(rows.map(r => r.speciality_id));
});


export default router;
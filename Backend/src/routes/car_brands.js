import express from "express";
import db from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT id, name FROM car_brands;
    `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los card_brands:", error);
        res.status(500).json({ message: "Error al obtener los card_brands" });
    }
});

export default router;
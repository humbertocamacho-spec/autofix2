import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Endpoint to get all cars for a client
router.get("/client/:client_id", async (req, res) => {
    const { client_id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                c.id, c.name, c.car_brand_id, c.model, c.year, c.type, c.plate,
                cb.name AS brand_name
            FROM cars_clients cc
            INNER JOIN cars c ON c.id = cc.car_id
            LEFT JOIN car_brands cb ON cb.id = c.car_brand_id
            WHERE cc.client_id = ?
        `, [client_id]);

        res.json(rows);

    } catch (error) {
        console.error("Error al obtener autos del cliente:", error);
        res.status(500).json({ message: "Error al obtener autos del cliente" });
    }
});

export default router;
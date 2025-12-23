import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Obtener autos de un cliente
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

// Crear un auto
router.post("/", async (req, res) => {
    const { name, car_brand_id, model, year, type, plate, client_id } = req.body;

    if (!name || !model || !plate || !car_brand_id || !type || !client_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const [result] = await db.query( `INSERT INTO cars (name, car_brand_id, model, year, type, plate) VALUES (?, ?, ?, ?, ?, ?)`, [name, car_brand_id, model, year, type, plate]);

        const carId = result.insertId;

        // Vincular auto al cliente
        await db.query( `INSERT INTO cars_clients (car_id, client_id) VALUES (?, ?)`,  [carId, client_id]);

        res.json({ ok: true, message: "Auto creado correctamente", carId });

    } catch (error) {
        console.error("Error creando auto:", error);
        res.status(500).json({ message: "Error creando auto" });
    }
});

// Actualizar un auto
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, car_brand_id, model, year, type, plate } = req.body;

    if (!name || !model || !plate || !car_brand_id || !type) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        await db.query(
            `UPDATE cars SET name = ?, car_brand_id = ?, model = ?, year = ?, type = ?, plate = ? WHERE id = ?`,
            [name, car_brand_id, model, year, type, plate, id]
        );

        res.json({ ok: true, message: "Auto actualizado correctamente" });

    } catch (error) {
        console.error("Error actualizando auto:", error);
        res.status(500).json({ message: "Error actualizando auto" });
    }
});

// Eliminar un auto
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Primero eliminar la relación con el cliente
        await db.query(`DELETE FROM cars_clients WHERE car_id = ?`, [id]);

        // Luego eliminar el auto
        await db.query(`DELETE FROM cars WHERE id = ?`, [id]);

        res.json({ ok: true, message: "Auto eliminado correctamente" });

    } catch (error) {
        console.error("Error eliminando auto:", error);
        res.status(500).json({ message: "Error eliminando auto" });
    }
});

export default router;

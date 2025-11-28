import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM cars");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener cars:", error);
        res.status(500).json({ message: "Error al obtener vehículos" });
    }
});

router.post("/", async (req, res) => {
    const { name, car_brand_id, model, year, type, plate, client_id } = req.body;

    if (!client_id) {
        return res.status(400).json({ message: "Falta client_id" });
    }

    if (!name || !car_brand_id || !model || !year || !plate) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ message: "El año debe tener 4 dígitos numéricos" });
    }

    const [existPlate] = await db.query(
        "SELECT id FROM cars WHERE plate = ?",
        [plate]
    );

    if (existPlate.length > 0) {
        return res.status(409).json({ message: "La placa ya está registrada en otro vehículo" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO cars (name, car_brand_id, model, year, type, plate) VALUES (?, ?, ?, ?, ?, ?)",
            [name, car_brand_id, model, year, type, plate]
        );

        const carId = result.insertId;
        await db.query(
            "INSERT INTO cars_clients (client_id, car_id) VALUES (?, ?)",
            [client_id, carId]
        );

        res.json({ ok: true, message: "Vehículo creado", car_id: carId });

    } catch (error) {
        console.error("Error al crear vehículo:", error);
        res.status(500).json({ message: "Error al crear vehículo" });
    }
});


router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, car_brand_id, model, year, type, plate } = req.body;

    console.log("Datos recibidos en updateCar:", req.body);

    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ message: "El año debe tener 4 dígitos numéricos" });
    }

    const [existPlate] = await db.query(
        "SELECT id FROM cars WHERE plate = ? AND id != ?",
        [plate, id]
    );

    if (existPlate.length > 0) {
        return res.status(409).json({ message: "Otra unidad ya usa esta placa" });
    }

    try {
        await db.query(
            "UPDATE cars SET name=?, car_brand_id=?, model=?, year=?, type=?, plate=? WHERE id=?",
            [name, car_brand_id, model, year, type, plate, id]
        );

        res.json({ ok: true, message: "Vehículo actualizado" });

    } catch (error) {
        console.error("Error al actualizar vehículo:", error);
        res.status(500).json({ message: "Error al actualizar vehículo" });
    }
});

export default router;

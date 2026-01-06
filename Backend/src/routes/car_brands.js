import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Endpoint to get all car brands
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

// Endpoint to create a car brand
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        await db.query(
            "INSERT INTO car_brands (name) VALUES (?)",
            [name]
        );

        res.json({ message: "Marca creada correctamente" });
    } catch (error) {
        console.error("Error al crear car_brand:", error);
        res.status(500).json({ message: "Error al crear car_brand" });
    }
});

// Endpoint to get a car brand by id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        await db.query(
            "UPDATE car_brands SET name = ? WHERE id = ?",
            [name, id]
        );

        res.json({ message: "Marca actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar car_brand:", error);
        res.status(500).json({ message: "Error al actualizar car_brand" });
    }
});

// Endpoint to delete a car brand by id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM car_brands WHERE id = ?",
            [id]
        );

        res.json({ message: "Marca eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar car_brand:", error);
        res.status(500).json({ message: "Error al eliminar car_brand" });
    }
});
export default router;
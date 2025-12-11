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

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, role_id, gender_id, photo_url } = req.body;

    try {
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await db.query(
            `
            UPDATE users
            SET 
                name = ?, 
                email = ?, 
                phone = ?, 
                address = ?, 
                role_id = ?, 
                gender_id = ?, 
                photo_url = ?
            WHERE id = ?
            `,
            [name, email, phone, address, role_id, gender_id, photo_url, id]
        );

        res.json({
            ok: true,
            message: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        res.status(500).json({ message: "Error actualizando usuario" });
    }
});

export default router;

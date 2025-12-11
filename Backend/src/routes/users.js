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

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, address, role_id, gender_id, photo_url } = req.body;

        if (!name || !email || !phone || !role_id) {
            return res.status(400).json({ ok: false, message: "Faltan campos obligatorios" });
        }

        // Validar email único
        const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (exists.length > 0) {
            return res.status(400).json({ ok: false, message: "El email ya está registrado" });
        }

        const [result] = await db.query(
            `
            INSERT INTO users (name, email, phone, address, role_id, gender_id, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                phone,
                address || null,
                role_id,
                gender_id || null,
                photo_url || null,
            ]
        );

        res.json({
            ok: true,
            message: "Usuario creado correctamente",
            id: result.insertId,
        });

    } catch (error) {
        console.error("Error creando usuario:", error);
        res.status(500).json({ ok: false, message: "Error creando usuario" });
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



router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await db.query("SELECT id FROM users WHERE id = ?", [id]);

        if (user.length === 0) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        }

        await db.query("DELETE FROM users WHERE id = ?", [id]);

        res.json({
            ok: true,
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ ok: false, message: "Error eliminando usuario" });
    }
});


export default router;

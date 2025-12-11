import express from "express";
import pool from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [admins] = await pool.query(`
            SELECT 
                a.id, 
                a.user_id,
                u.name AS user_name
            FROM admins a
            LEFT JOIN users u ON u.id = a.user_id
            `);

        res.json({ ok: true, admins });
    } catch (error) {
        console.error("Error al obtener admins:", error);
        res.status(500).json({ ok: false, message: "Error al obtener admins" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) return res.status(400).json({ error: "user_id es requerido" });

        await pool.query(`INSERT INTO admins (user_id) VALUES (?)`, [user_id]);

        res.json({ ok: true, message: "Admin creado correctamente" });
    } catch (error) {
        console.error("Error al crear admin:", error);
        res.status(500).json({ ok: false, message: "Error al crear admin" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;

        if (!user_id) return res.status(400).json({ error: "user_id es requerido" });

        await pool.query(`UPDATE admins SET user_id = ? WHERE id = ?`, [user_id, id]);

        res.json({ ok: true, message: "Admin actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar admin:", error);
        res.status(500).json({ ok: false, message: "Error al actualizar admin" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`DELETE FROM admins WHERE id = ?`, [id]);

        res.json({ ok: true, message: "Admin eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar admin:", error);
        res.status(500).json({ ok: false, message: "Error al eliminar admin" });
    }
});


export default router;

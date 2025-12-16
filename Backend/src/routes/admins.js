import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get admins
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

// Create admin
router.post("/", async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ ok: false, message: "user_id es requerido" });
        }

        await connection.beginTransaction();

        await connection.query(
            `INSERT INTO admins (user_id) VALUES (?)`,
            [user_id]
        );

        await connection.query(
            `UPDATE users SET role = 'admin' WHERE id = ?`,
            [user_id]
        );

        await connection.commit();

        res.json({
            ok: true,
            message: "Admin creado y rol cambiado a admin correctamente"
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error al crear admin:", error);
        res.status(500).json({ ok: false, message: "Error al crear admin" });
    } finally {
        connection.release();
    }
});

// Update admin
router.put("/:id", async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { id } = req.params;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ ok: false, message: "user_id es requerido" });
        }

        await connection.beginTransaction();

        const [[oldAdmin]] = await connection.query(
            `SELECT user_id FROM admins WHERE id = ?`,
            [id]
        );

        if (!oldAdmin) {
            await connection.rollback();
            return res.status(404).json({ ok: false, message: "Admin no encontrado" });
        }

        await connection.query(
            `UPDATE admins SET user_id = ? WHERE id = ?`,
            [user_id, id]
        );

        await connection.query(
            `UPDATE users SET role = 'client' WHERE id = ?`,
            [oldAdmin.user_id]
        );

        await connection.query(
            `UPDATE users SET role = 'admin' WHERE id = ?`,
            [user_id]
        );

        await connection.commit();

        res.json({
            ok: true,
            message: "Admin actualizado correctamente"
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error al actualizar admin:", error);
        res.status(500).json({ ok: false, message: "Error al actualizar admin" });
    } finally {
        connection.release();
    }
});

// Delete admin
router.delete("/:id", async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { id } = req.params;

        await connection.beginTransaction();

        const [[admin]] = await connection.query(
            `SELECT user_id FROM admins WHERE id = ?`,
            [id]
        );

        if (!admin) {
            await connection.rollback();
            return res.status(404).json({ ok: false, message: "Admin no encontrado" });
        }

        await connection.query(
            `DELETE FROM admins WHERE id = ?`,
            [id]
        );

        await connection.query(
            `UPDATE users SET role = 'client' WHERE id = ?`,
            [admin.user_id]
        );

        await connection.commit();

        res.json({
            ok: true,
            message: "Admin eliminado y rol cambiado a client correctamente"
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error al eliminar admin:", error);
        res.status(500).json({ ok: false, message: "Error al eliminar admin" });
    } finally {
        connection.release();
    }
});

export default router;

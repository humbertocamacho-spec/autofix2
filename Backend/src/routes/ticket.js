import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const client_id = req.query.client_id;
    const { role_name, partner_id } = req.user;
    const params = [];

    let query = `
      SELECT 
        t.id,
        t.client_id,
        u.name AS client_name,
        t.car_id,
        c.name AS car_name,
        t.partner_id,
        p.name AS partner_name,
        p.logo_url,       
        p.phone,
        t.date,
        t.notes
      FROM tickets t
      LEFT JOIN users u ON u.id = t.client_id
      LEFT JOIN cars c ON c.id = t.car_id
      LEFT JOIN partners p ON p.id = t.partner_id
    `;

    if (client_id) {
      query += ` WHERE t.client_id = ?`;
      params.push(Number(client_id));
    }

    if (role_name === "partner") {
      query += client_id ? ` AND` : ` WHERE`;
      query += ` t.partner_id = ?`;
      params.push(partner_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error("Error obteniendo tickets", error);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
});

router.get("/:car_id/:partner_id/:client_id", async (req, res) => {
    const { car_id, partner_id, client_id } = req.params;

    try {
        const [carRows] = await db.query(`
            SELECT c.*, cb.name AS brand_name
            FROM cars c
            LEFT JOIN car_brands cb ON cb.id = c.car_brand_id
            WHERE c.id = ?
        `, [car_id]);

        if (!carRows.length)
            return res.status(404).json({ message: "Vehículo no encontrado" });

        const [partnerRows] = await db.query(`SELECT * FROM partners WHERE id = ?`, [partner_id]);
        if (!partnerRows.length)
            return res.status(404).json({ message: "Taller no encontrado" });

        const [clientRows] = await db.query(`SELECT * FROM clients WHERE id = ?`, [client_id]);
        if (!clientRows.length)
            return res.status(404).json({ message: "Cliente no encontrado" });

        const [ticketRows] = await db.query(`
            SELECT *
            FROM tickets
            WHERE car_id = ? AND partner_id = ? AND client_id = ?
            ORDER BY id DESC
            LIMIT 1
        `, [car_id, partner_id, client_id]);

        res.json({
            car: carRows[0],
            partner: partnerRows[0],
            client: clientRows[0],
            ticket: ticketRows.length ? ticketRows[0] : null
        });

    } catch (error) {
        console.error("Error obteniendo ticket:", error);
        res.status(500).json({ message: "Error al obtener ticket" });
    }
});

router.get("/by-id/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`SELECT * FROM tickets WHERE id = ?`, [id]);

        if (!rows.length)
            return res.status(404).json({ message: "Ticket no encontrado" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error obteniendo ticket:", error);
        res.status(500).json({ message: "Error al obtener ticket" });
    }
});

router.post("/", async (req, res) => {
    const { client_id, car_id, partner_id, date, notes } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO tickets (client_id, car_id, partner_id, date, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [client_id, car_id, partner_id, date, notes]
        );

        res.json({ message: "Ticket creado", id: result.insertId });

    } catch (error) {
        console.error("Error creando ticket:", error);
        res.status(500).json({ message: "Error creando ticket" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "DELETE FROM tickets WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Ticket no encontrado" });
        }

        return res.json({ ok: true, message: "Ticket eliminado correctamente" });

    } catch (error) {
        console.error("Error eliminando ticket:", error);
        res.status(500).json({ ok: false, message: "Error al eliminar el ticket" });
    }
});

router.get("/occupied", async (req, res) => {
    try {
        const { partner_id, date } = req.query;

        if (!partner_id || !date) {
            return res.status(400).json({ message: "Faltan parámetros (partner_id o date)" });
        }

        const [rows] = await db.query(
            `
            SELECT 
                DATE_FORMAT(date, '%h:%i %p') AS hour
            FROM 
                tickets
            WHERE 
                partner_id = ? 
                AND DATE(date) = ?
            `,
            [partner_id, date]
        );

        const occupiedHours = rows.map(r => r.hour);

        return res.json({ occupied_hours: occupiedHours });

    } catch (error) {
        console.error("Error obteniendo horas ocupadas:", error);
        return res.status(500).json({ message: "Error obteniendo horas ocupadas" });
    }
});

export default router;

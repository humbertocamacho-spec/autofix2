import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { role_name, partner_id, client_id } = req.user;
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

    if (role_name === "partner") {
      query += ` WHERE t.partner_id = ?`;
      params.push(partner_id);
    }

    if (role_name === "client") {
      query += ` WHERE t.client_id = ?`;
      params.push(client_id);
    }

    query += ` ORDER BY t.date DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error("Error obteniendo tickets:", error);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
});

router.get("/by-id/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { role_name, partner_id, client_id } = req.user;

    try {
        let query = `SELECT * FROM tickets WHERE id = ?`;
        const params = [id];

        if (role_name === "partner") {
            query += ` AND partner_id = ?`;
            params.push(partner_id);
        } else if (role_name === "client") {
            query += ` AND client_id = ?`;
            params.push(client_id);
        }

        const [rows] = await db.query(query, params);

        if (!rows.length)
            return res.status(404).json({ message: "Ticket no encontrado" });

        res.json(rows[0]);

    } catch (error) {
        console.error("Error obteniendo ticket:", error);
        res.status(500).json({ message: "Error al obtener ticket" });
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

export default router;

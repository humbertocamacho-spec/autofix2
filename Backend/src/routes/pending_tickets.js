import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    
    const { user_id } = req.user;
    const {
      car_id,
      partner_id,
      date,
      time,
      notes,
      logo_url,
      partner_name,
      partner_phone
    } = req.body;

    if (!client_id || !car_id || !partner_id || !date || !time) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [result] = await db.query(
      `INSERT INTO pending_tickets 
        (client_id, car_id, partner_id, date, time, notes, logo_url, partner_name, partner_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id,
        car_id,
        partner_id,
        date,
        time,
        notes || "",
        logo_url || "",
        partner_name || "",
        partner_phone || ""
      ]
    );

    res.json({
      message: "Pending ticket creado",
      id: result.insertId
    });

  } catch (error) {
    console.error("Error insertando pending_ticket:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { user_id, role_id } = req.user;

    const [roleRow] = await db.query(
      "SELECT name FROM roles WHERE id = ?",
      [role_id]
    );

    const roleName = roleRow[0]?.name?.toLowerCase();

    let sql = `
      SELECT 
        p.id,

        p.client_id,
        u.name AS client_name,

        p.car_id,
        c.name AS car_name,

        p.partner_id,
        p.partner_name,
        p.partner_phone,
        p.logo_url,

        p.date,
        p.time,
        p.notes

      FROM pending_tickets p
      INNER JOIN clients cl ON cl.id = p.client_id
      INNER JOIN users u ON u.id = cl.user_id
      LEFT JOIN cars c ON c.id = p.car_id
    `;

    const params = [];

    if (roleName === "client") {
      sql += " WHERE u.id = ?";
      params.push(user_id);
    }

    sql += " ORDER BY p.id ASC";

    const [rows] = await db.query(sql, params);
    res.json(rows);

  } catch (error) {
    console.error("Error al obtener pending tickets:", error);
    res.status(500).json({ message: "Error al obtener pending tickets" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ error: "ID inválido" });

    const [result] = await db.query(
      "DELETE FROM pending_tickets WHERE id = ?",
      [idNum]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pending ticket no encontrado" });
    }

    res.status(200).json({ message: "Pending ticket eliminado correctamente" });

  } catch (error) {
    console.error("Error eliminando pending_ticket:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { date, time, notes } = req.body;

    if (date === undefined && time === undefined && notes === undefined) {
      return res.status(400).json({ error: "Nada que actualizar" });
    }

    const updates = [];
    const values = [];

    if (date !== undefined) { updates.push("date = ?"); values.push(date); }
    if (time !== undefined) { updates.push("time = ?"); values.push(time); }
    if (notes !== undefined) { updates.push("notes = ?"); values.push(notes ?? ""); }

    values.push(id);

    const [result] = await db.query(
      `UPDATE pending_tickets SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    console.error("Error PUT pending_tickets:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;

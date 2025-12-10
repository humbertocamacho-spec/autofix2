import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      client_id,
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
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pending_tickets");
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo pending tickets:", error);
    res.status(500).json({ error: "Error al obtener pending tickets" });
  }
});

router.get("/:client_id", async (req, res) => {
  try {
    const { client_id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM pending_tickets WHERE client_id = ?",
      [client_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo pending tickets:", error);
    res.status(500).json({ error: "Error al obtener pending tickets" });
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

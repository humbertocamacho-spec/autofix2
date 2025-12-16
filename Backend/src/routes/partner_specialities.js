import express from "express";
import db from "../config/db.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT 
                ps.id, 
                ps.partner_id, 
                ps.speciality_id
            FROM partners_specialities AS ps
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las specialities:", error);
        res.status(500).json({ message: "Error al obtener las specialities" });
    }
});

//Obtener especialidades por partner
router.get("/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT speciality_id
      FROM partners_specialities
      WHERE partner_id = ?
      `,
      [partnerId]
    );

    res.json(rows.map(r => r.speciality_id));
  } catch (error) {
    console.error("Error al obtener especialidades del partner:", error);
    res.status(500).json({ message: "Error al obtener especialidades" });
  }
});

//Guardar especialidades de un partner
router.post("/", async (req, res) => {
  const { partner_id, speciality_ids } = req.body;

  if (!partner_id || !Array.isArray(speciality_ids)) {
    return res.status(400).json({ message: "Datos inválidos" });
  }

  try {
    //Eliminar relaciones anteriores
    await db.query(
      `DELETE FROM partners_specialities WHERE partner_id = ?`,
      [partner_id]
    );

    //Insertar nuevas relaciones
    if (speciality_ids.length > 0) {
      const values = speciality_ids.map(id => [partner_id, id]);
      await db.query(
        `INSERT INTO partners_specialities (partner_id, speciality_id) VALUES ?`,
        [values]
      );
    }

    res.json({ message: "Especialidades actualizadas correctamente" });
  } catch (error) {
    console.error("Error al guardar especialidades:", error);
    res.status(500).json({ message: "Error al guardar especialidades" });
  }
});


export default router;
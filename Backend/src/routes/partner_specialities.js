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

router.get("/partner/:partnerId", async (req, res) => {
    try {
        const { partnerId } = req.params;
        const [rows] = await db.query(`
      SELECT 
        ps.speciality_id,
        s.name
      FROM partners_specialities ps
      INNER JOIN specialities s ON s.id = ps.speciality_id
      WHERE ps.partner_id = ?
    `, [partnerId]);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener especialidades del partner:", error);
        res.status(500).json({ message: "Error al obtener especialidades" });
    }
});

router.post("/partner/:partnerId", async (req, res) => {
    const { partnerId } = req.params;
    const { specialities } = req.body;

    if (!Array.isArray(specialities)) {
        return res.status(400).json({ message: "specialities inválidas" });
    }

    try {
        for (const specialityId of specialities) {
            await db.query(
                `INSERT INTO partners_specialities (partner_id, speciality_id)
         VALUES (?, ?)`,
                [partnerId, specialityId]
            );
        }

        res.json({ ok: true, message: "Especialidades creadas correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear especialidades" });
    }
});


router.put("/partner/:partnerId", async (req, res) => {
  const { partnerId } = req.params;
  const { specialities } = req.body;

  if (!Array.isArray(specialities)) {
    return res.status(400).json({ message: "specialities inválidas" });
  }

  try {
    
    if (specialities.length > 0) {
      await db.query(
        `
        DELETE FROM partners_specialities
        WHERE partner_id = ?
        AND speciality_id NOT IN (${specialities.map(() => "?").join(",")})
        `,
        [partnerId, ...specialities]
      );
    } else {

      await db.query(
        `DELETE FROM partners_specialities WHERE partner_id = ?`,
        [partnerId]
      );
    }

    for (const specialityId of specialities) {
      await db.query(
        `
        INSERT INTO partners_specialities (partner_id, speciality_id)
        SELECT ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM partners_specialities
          WHERE partner_id = ? AND speciality_id = ?
        )
        `,
        [partnerId, specialityId, partnerId, specialityId]
      );
    }

    res.json({ ok: true, message: "Especialidades actualizadas correctamente" });
  } catch (error) {
    console.error("Error al actualizar especialidades:", error);
    res.status(500).json({ message: "Error al actualizar especialidades" });
  }
});


export default router;
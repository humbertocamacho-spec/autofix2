import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token requerido"
      });
    }
    
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        ok: false,
        message: "Formato de token inválido"
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      `SELECT id, role_id, deleted_at
       FROM users
       WHERE id = ?`,
      [decoded.user_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no existe"
      });
    }

    if (rows[0].deleted_at) {
      return res.status(403).json({
        ok: false,
        message: "Usuario desactivado"
      });
    }

    req.user = {
      id: rows[0].id,
      role_id: rows[0].role_id,
      role_name: decoded.role_name,
      client_id: decoded.client_id,
      partner_id: decoded.partner_id
    };

    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado"
    });
  }
}

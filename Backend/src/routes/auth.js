// src/routes/auth.js (o donde tengas el router)
import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Validaciones
const emailvalidate = /^[^\s@]+@gmail\.com$/;
const phonevalidate = /^[0-9]{10}$/;

// Middleware de autenticación
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ ok: false, message: "No token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id: 1, role_id: 1 }
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Token inválido" });
  }
}

// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email y password son requeridos' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });
    }

    // Obtener permisos
    const [permissions] = await pool.query(
      `SELECT p.name
       FROM roles_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    // Obtener client_id / partner_id
    let client_id = null, partner_id = null;
    if (user.role_id === 3) {
      const [c] = await pool.query("SELECT id FROM clients WHERE user_id = ?", [user.id]);
      client_id = c.length > 0 ? c[0].id : null;
    }
    if (user.role_id === 2) {
      const [p] = await pool.query("SELECT id FROM partners WHERE user_id = ?", [user.id]);
      partner_id = p.length > 0 ? p[0].id : null;
    }

    // Generar token
    const token = jwt.sign(
      { user_id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // RESPUESTA FINAL
    res.json({
      ok: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name || null,
        email: user.email,
        role_id: user.role_id,
        client_id,
        partner_id,
        permissions: permissions.map(p => p.name)
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ ok: false, message: 'Error al iniciar sesión' });
  }
});

// ==================== REGISTER ====================
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }
    if (!emailvalidate.test(email)) return res.status(400).json({ ok: false, message: "Correo inválido" });
    if (!phonevalidate.test(phone)) return res.status(400).json({ ok: false, message: "Teléfono inválido" });
    if (password.length < 8) return res.status(400).json({ ok: false, message: "Contraseña mínima de 8 caracteres" });

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ ok: false, message: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, phone, email, password, role_id) VALUES (?, ?, ?, ?, 3)',
      [name, phone, email, hashedPassword]
    );

    const userId = result.insertId;
    await pool.query('INSERT INTO clients (user_id) VALUES (?)', [userId]);

    res.json({ ok: true, message: 'Usuario y cliente creados', userId });

  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ ok: false, message: 'Error al registrar usuario' });
  }
});

// ==================== /ME (USUARIO ACTUAL) ====================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Calcular client_id y partner_id (igual que en login)
    let client_id = null, partner_id = null;
    if (user.role_id === 3) {
      const [c] = await pool.query("SELECT id FROM clients WHERE user_id = ?", [user.id]);
      client_id = c.length > 0 ? c[0].id : null;
    }
    if (user.role_id === 2) {
      const [p] = await pool.query("SELECT id FROM partners WHERE user_id = ?", [user.id]);
      partner_id = p.length > 0 ? p[0].id : null;
    }

    // Obtener permisos
    const [permissions] = await pool.query(
      `SELECT p.name 
       FROM roles_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    // RESPUESTA FINAL (igual que login)
    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name || null,
        email: user.email,
        role_id: user.role_id,
        client_id,
        partner_id,
        permissions: permissions.map(p => p.name)
      }
    });

  } catch (error) {
    console.error("Error en /me:", error);
    res.status(500).json({ ok: false, message: "Error en /me" });
  }
});

export default router;
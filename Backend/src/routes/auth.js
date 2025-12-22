import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ROLES, getRoleId } from "../utils/roles.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const emailvalidate = /^[^\s@]+@gmail\.com$/;
const phonevalidate = /^[0-9]{10}$/;

async function getRoleName(roleId) {
  const [rows] = await pool.query('SELECT name FROM roles WHERE id = ?', [roleId]);
  return rows.length > 0 ? rows[0].name.toLowerCase() : 'client';
}

// Endpoint Login 
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

    // Prohibir acceso a usuarios desactivados
    if (user.deleted_at) {
      return res.status(403).json({ ok: false, message: 'Usuario desactivado. Contacta al administrador.' });
    }

    const roleName = await getRoleName(user.role_id);

    const [permissions] = await pool.query(
      `SELECT p.name
       FROM roles_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    let client_id = null, partner_id = null;

    const [c] = await pool.query("SELECT id FROM clients WHERE user_id = ?", [user.id]);
    client_id = c.length > 0 ? c[0].id : null;

    if (roleName === ROLES.PARTNER) {
      const [p] = await pool.query("SELECT id FROM partners WHERE user_id = ?", [user.id]);
      partner_id = p.length > 0 ? p[0].id : null;
    }

    const token = jwt.sign(
      { user_id: user.id, role_id: user.role_id,role_name: roleName,client_id: client_id,partner_id: partner_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name || null,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url || null,
        role_id: user.role_id,
        role_name: roleName,         
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

// Endpoint Register
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
    const clientRoleId = await getRoleId(ROLES.CLIENT);

    const [result] = await pool.query(
      'INSERT INTO users (name, phone, email, password, role_id) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email, hashedPassword, clientRoleId]
    );

    const userId = result.insertId;
    await pool.query('INSERT INTO clients (user_id) VALUES (?)', [userId]);

    res.json({ ok: true, message: 'Usuario y cliente creados', userId });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ ok: false, message: 'Error al registrar usuario' });
  }
});

// Endpoint Get Me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const roleName = await getRoleName(user.role_id);

    let client_id = null, partner_id = null;

    const [c] = await pool.query("SELECT id FROM clients WHERE user_id = ?", [user.id]);
    client_id = c.length > 0 ? c[0].id : null;

    if (roleName === ROLES.PARTNER) {
      const [p] = await pool.query("SELECT id FROM partners WHERE user_id = ?", [user.id]);
      partner_id = p.length > 0 ? p[0].id : null;
    }

    const [permissions] = await pool.query(
      `SELECT p.name
       FROM roles_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name || null,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url || null,
        role_id: user.role_id,
        role_name: roleName,          
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
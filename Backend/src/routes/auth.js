import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();
const emailvalidate = /^[^\s@]+@gmail\.com$/;
const phonevalidate= /^[0-9]{10}$/;

//Ruta Login
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
        if (!validPassword) return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });

    res.json({ ok: true, message: 'Login exitoso', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al iniciar sesión' });
  }
});

//Ruta Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }

    if (!emailvalidate.test(email)) {
        return res.status(400).json({ ok: false, message:"Correo Invalido"})
    }

    if (!phonevalidate.test(phone)) {
        return res.status(400).json({ ok: false, message:"Telefono Invalido"})
    }

    if (password.length < 8) {
        return res.status(400).json({ ok: false, message:"Contraseña minima de 8 caracteres"})
    }

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ ok: false, message: 'Email ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const [result] = await pool.query(
      'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)',
      [name, phone, email, hashedPassword]
    );

    res.json({ ok: true, message: 'Usuario registrado', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al registrar usuario' });
  }
});

export default router;

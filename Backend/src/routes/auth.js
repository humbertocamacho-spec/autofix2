import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email y password son requeridos' });
    }

    // Buscar usuario
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // ⚠️ Si tus passwords aún NO están hasheados, compara directo:
    if (user.password !== password) {
      return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });
    }

    // Si usas bcrypt:
    // const validPassword = await bcrypt.compare(password, user.password);
    // if (!validPassword) return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });

    res.json({ ok: true, message: 'Login exitoso', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al iniciar sesión' });
  }
});

// Ruta POST para registrar usuarios
router.post('/register', async (req, res) => {
  try {
    const { name, lastname, phone, email, password } = req.body;

    if (!name || !lastname || !phone || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Todos los campos son obligatorios' });
    }

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ ok: false, message: 'Email ya registrado' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, lastname, phone, email, password) VALUES (?, ?, ?, ?, ?)',
      [name, lastname, phone, email, password]
    );

    res.json({ ok: true, message: 'Usuario registrado', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al registrar usuario' });
  }
});

export default router;

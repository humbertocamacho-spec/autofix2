import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT NOW() AS currentTime');
  res.json({ message: 'Servidor activo', time: rows[0].currentTime });
});

app.use('/api/auth', authRoutes);

app.listen(config.server.port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${config.server.port}`);
});

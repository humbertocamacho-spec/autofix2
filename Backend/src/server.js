import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js'; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS fecha');
    res.json({ ok: true, serverTime: rows[0].fecha });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(config.server.port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${config.server.port}`);
});

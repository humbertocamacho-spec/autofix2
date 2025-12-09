import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js'; 
import partnerRoutes from './routes/partner.js';
import specialitiesRoutes from './routes/specialities.js';
import partnerspecialitiesRoutes from './routes/partner_specialities.js';
import carBrandsRoutes from './routes/car_brands.js';
import carRoutes from './routes/car.js';
import ticketRoutes from "./routes/ticket.js";
import carClientsRoutes from "./routes/car_clients.js";
import clientRoutes from "./routes/client.js";
import pendingTicketsRoutes from "./routes/pending_tickets.js";
import partnerCertificationsRoutes from "./routes/partner_certifications.js";
import rolesRoutes from "./routes/roles.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/partners", partnerRoutes);
app.use('/api/specialities', specialitiesRoutes);
app.use('/api/partner_specialities', partnerspecialitiesRoutes);
app.use('/api/car_brands', carBrandsRoutes);
app.use('/api/car', carRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/car_clients", carClientsRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/pending_tickets", pendingTicketsRoutes);
app.use("/api/partner_certifications", partnerCertificationsRoutes);
app.use("/api/roles", rolesRoutes);

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
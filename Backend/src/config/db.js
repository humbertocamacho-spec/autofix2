import mysql from 'mysql2/promise';
import { config } from './env.js';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado correctamente a MySQL (Railway)');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
  }
})();

export default pool;

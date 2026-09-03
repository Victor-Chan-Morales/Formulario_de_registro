// server/db.js
// Pool de conexiones a PostgreSQL
// Usa la variable DATABASE_URL del archivo .env
// Railway la proporciona automáticamente en el formato:
//   postgresql://usuario:contraseña@host:5432/nombre_db

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error('❌ Variable DATABASE_URL no configurada en el archivo .env');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Railway requiere SSL en producción
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});

// Verifica la conexión al iniciar
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.message);
        return;
    }
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    release();
});

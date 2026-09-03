// server/index.js
// Servidor Express — reemplaza toda la lógica que antes hacía Supabase

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import { pool } from './db.js';
import { enviarCorreoVerificacion } from './mailer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ────────────────────────────────────────────────────────────
app.use(express.json());

// Permite peticiones desde el frontend de Vite (http://localhost:5173)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

// ─── POST /api/registro ─────────────────────────────────────────────────────
// Recibe: { nombre, apellidos, edad, correo, password, confirmPassword }
// Acciones:
//   1. Valida campos básicos en el servidor (segunda capa de seguridad)
//   2. Verifica que el correo no esté ya registrado
//   3. Hashea la contraseña con bcrypt (saltRounds=12)
//   4. Genera un token UUID único de verificación
//   5. Inserta el usuario en la tabla `usuarios` de PostgreSQL
//   6. Envía el correo de verificación via Gmail
app.post('/api/registro', async (req, res) => {
    const { nombre, apellidos, edad, correo, password, confirmPassword } = req.body;

    // 1. Validación en el servidor
    if (!nombre || !apellidos || !edad || !correo || !password || !confirmPassword) {
        return res.status(400).json({ exito: false, error: 'Todos los campos son requeridos.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ exito: false, error: 'Las contraseñas no coinciden.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ exito: false, error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 18 || edadNum > 100) {
        return res.status(400).json({ exito: false, error: 'La edad debe estar entre 18 y 100 años.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ exito: false, error: 'Formato de correo inválido.' });
    }

    try {
        // 2. Verificar que el correo no exista ya
        const { rows: existentes } = await pool.query(
            'SELECT id FROM usuarios WHERE correo = $1',
            [correo.toLowerCase().trim()]
        );
        if (existentes.length > 0) {
            return res.status(409).json({ exito: false, error: 'Este correo ya está registrado.' });
        }

        // 3. Hashear la contraseña (nunca guardar texto plano)
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Generar token único de verificación
        const tokenVerificacion = uuidv4();

        // 5. Insertar en PostgreSQL
        await pool.query(
            `INSERT INTO usuarios (nombre, apellidos, edad, correo, password_hash, token_verificacion)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                nombre.trim(),
                apellidos.trim(),
                edadNum,
                correo.toLowerCase().trim(),
                passwordHash,
                tokenVerificacion,
            ]
        );

        console.log(`✅ Usuario registrado: ${correo}`);

        // 6. Enviar correo de verificación (no bloqueamos la respuesta si falla)
        try {
            await enviarCorreoVerificacion(correo, nombre, tokenVerificacion);
        } catch (mailError) {
            // El usuario ya fue guardado. El correo falló pero no revertimos el registro.
            console.error('⚠️ Usuario guardado pero error al enviar correo:', mailError.message);
            return res.status(201).json({
                exito: true,
                advertencia: 'Registro exitoso, pero el correo de verificación no pudo enviarse. Contacta al administrador.',
            });
        }

        return res.status(201).json({
            exito: true,
            mensaje: 'Registro exitoso. Revisa tu bandeja de correo para verificar tu cuenta.',
        });

    } catch (err) {
        console.error('❌ Error en /api/registro:', err.message);
        return res.status(500).json({ exito: false, error: 'Error interno del servidor. Intenta más tarde.' });
    }
});

// ─── GET /api/verificar?token=... ───────────────────────────────────────────
// El usuario hace clic en el link del correo → este endpoint:
//   1. Busca el token en la BD
//   2. Marca la cuenta como verificada (verificado = TRUE, borra el token)
//   3. Retorna una página HTML de confirmación
app.get('/api/verificar', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('<h2>❌ Token inválido o faltante.</h2>');
    }

    try {
        const { rowCount } = await pool.query(
            `UPDATE usuarios
             SET verificado = TRUE, token_verificacion = NULL
             WHERE token_verificacion = $1 AND verificado = FALSE`,
            [token]
        );

        if (rowCount === 0) {
            return res.status(400).send(`
                <div style="font-family: Arial; text-align: center; padding: 60px;">
                    <h2>⚠️ Este enlace ya fue usado o no es válido.</h2>
                    <p>Si ya verificaste tu cuenta, puedes cerrar esta ventana.</p>
                </div>
            `);
        }

        return res.status(200).send(`
            <div style="font-family: Arial; text-align: center; padding: 60px; color: #2d6a4f;">
                <h1>✅ ¡Cuenta verificada correctamente!</h1>
                <p style="color: #444;">Tu cuenta ha sido activada. Ya puedes iniciar sesión.</p>
            </div>
        `);

    } catch (err) {
        console.error('❌ Error en /api/verificar:', err.message);
        return res.status(500).send('<h2>Error interno. Intenta de nuevo más tarde.</h2>');
    }
});

// ─── Iniciar servidor ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});

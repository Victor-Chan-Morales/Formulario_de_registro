// server/mailer.js
// Configuración de Nodemailer para envío de correos via Gmail SMTP
//
// REQUISITO PREVIO: Habilitar "Contraseñas de aplicación" en tu cuenta Gmail:
// 1. Ve a: https://myaccount.google.com/security
// 2. Activa la Verificación en dos pasos (si no la tienes)
// 3. Ve a: https://myaccount.google.com/apppasswords
// 4. Crea una contraseña para "Otra aplicación" → copia las 16 letras
// 5. Ponla en GMAIL_APP_PASSWORD en tu .env (sin espacios)

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('❌ Variables GMAIL_USER o GMAIL_APP_PASSWORD no configuradas en .env');
}

// Transporter reutilizable (se crea una sola vez)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,  // Contraseña de aplicación (16 dígitos)
    },
});

/**
 * Envía el correo de verificación al usuario recién registrado.
 * @param {string} destinatario - Email del usuario
 * @param {string} nombre - Nombre del usuario (para personalizar el mensaje)
 * @param {string} token - UUID único de verificación
 */
export async function enviarCorreoVerificacion(destinatario, nombre, token) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const linkVerificacion = `${baseUrl}/api/verificar?token=${token}`;

    const opcionesCorreo = {
        from: `"Registro Seguro" <${process.env.GMAIL_USER}>`,
        to: destinatario,
        subject: '✅ Confirma tu cuenta — Registro Seguro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; 
                        background: #f9f9f9; border-radius: 8px; padding: 32px;">
                <h2 style="color: #2d6a4f; margin-bottom: 8px;">¡Hola, ${nombre}!</h2>
                <p style="color: #444; line-height: 1.6;">
                    Gracias por registrarte. Por favor confirma tu cuenta haciendo clic 
                    en el siguiente botón:
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${linkVerificacion}"
                       style="background: #2d6a4f; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 6px; font-weight: bold;
                              font-size: 16px;">
                        Verificar mi cuenta
                    </a>
                </div>
                <p style="color: #888; font-size: 13px;">
                    Si no te registraste, puedes ignorar este correo.<br>
                    Este enlace es de un solo uso.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;">
                <p style="color: #bbb; font-size: 11px; text-align: center;">
                    Registro Seguro — Proyecto Universitario
                </p>
            </div>
        `,
    };

    await transporter.sendMail(opcionesCorreo);
    console.log(`📧 Correo de verificación enviado a: ${destinatario}`);
}

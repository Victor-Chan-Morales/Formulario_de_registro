// js/authService.js
// Servicio de autenticación — ahora usa el backend Express propio
// (ya no depende de Supabase)

// URL base del servidor Express (configurable via variable de entorno de Vite)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class AuthService {
    /**
     * Registra un nuevo usuario enviando los datos al servidor Express.
     * El servidor se encarga de:
     *   - Validar en el lado del servidor
     *   - Hashear la contraseña con bcrypt
     *   - Guardar en PostgreSQL
     *   - Enviar el correo de verificación via Gmail
     *
     * @param {Object} datos - { nombre, apellidos, edad, correo, password, confirmPassword }
     * @returns {Promise<{exito: boolean, error?: string}>}
     */
    static async registrarUsuario(datos) {
        try {
            const response = await fetch(`${API_URL}/api/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });

            const resultado = await response.json();

            if (!response.ok) {
                // El servidor devolvió un error HTTP (400, 409, 500...)
                return { exito: false, error: resultado.error || 'Error desconocido del servidor.' };
            }

            return { exito: true, data: resultado };

        } catch (error) {
            // Error de red (servidor apagado, sin internet, etc.)
            return {
                exito: false,
                error: 'No se pudo conectar al servidor. ¿Está corriendo "npm run server"?'
            };
        }
    }
}
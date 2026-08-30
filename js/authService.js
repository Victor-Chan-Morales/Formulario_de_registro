import { supabase } from './supabaseClient.js';

export class AuthService {
    static async registrarUsuario(datos) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: datos.correo,
                password: datos.password,
                options: {
                    // Estos datos se enviarán como meta-datos y el Trigger SQL los capturará
                    data: {
                        nombre: datos.nombre,
                        apellidos: datos.apellidos,
                        edad: datos.edad
                    }
                }
            });

            if (error) throw error;
            return { exito: true, data };
        } catch (error) {
            return { exito: false, error: error.message };
        }
    }
}
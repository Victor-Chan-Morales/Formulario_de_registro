export class EmailService {
    static async enviarCorreoDemo() {
        try {
            const apiKey = import.meta.env.VITE_RESEND_API_KEY;

            // Usamos el proxy configurado en vite.config.js para evitar errores de CORS
            const response = await fetch('/api/resend/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    from: 'onboarding@resend.dev',
                    to: 'lunguita100000@gmail.com',
                    subject: 'Hello World',
                    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar el correo');
            }

            console.log('Correo enviado con éxito:', data);
            return { exito: true, data };
        } catch (error) {
            console.error('Error en EmailService:', error);
            return { exito: false, error: error.message };
        }
    }
}

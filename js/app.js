import { validarDatos } from './validator.js';
import { AuthService } from './authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const mensajeEl = document.getElementById('mensaje');
    const submitBtn = document.getElementById('submitBtn');

    // Validación en tiempo real para contraseñas
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const correoInput = document.getElementById('correo');

    passwordInput?.addEventListener('input', validarContrasenas);
    confirmPasswordInput?.addEventListener('input', validarContrasenas);
    correoInput?.addEventListener('blur', validarCorreo);

    function validarContrasenas() {
        if (passwordInput.value && confirmPasswordInput.value) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                mostrarMensaje('⚠️ Las contraseñas no coinciden', 'warning');
            } else if (passwordInput.value.length >= 8) {
                mostrarMensaje('✓ Contraseñas válidas', 'success');
            }
        }
    }

    function validarCorreo() {
        const correo = correoInput.value.trim();
        if (correo) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(correo)) {
                mostrarMensaje('❌ Formato de correo inválido', 'error');
            } else {
                mostrarMensaje('✓ Correo válido', 'success');
            }
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeEl.textContent = '';
        mensajeEl.className = 'mensaje';
        
        // 1. Extraer datos del formulario
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        datos.edad = parseInt(datos.edad);

        // 2. Validar datos
        const validacion = validarDatos(datos);
        if (!validacion.esValido) {
            mostrarMensaje(`❌ ${validacion.error}`, 'error');
            return;
        }

        // 3. Procesar Registro
        estadoCargando(true);
        mostrarMensaje('⏳ Procesando registro...', 'info');
        
        const resultado = await AuthService.registrarUsuario(datos);
        estadoCargando(false);

        // 4. Resultado
        if (resultado.exito) {
            mostrarMensaje('✅ ¡Registro exitoso! Revisa tu bandeja de correo para confirmar tu cuenta.', 'success');
            form.reset();
            setTimeout(() => {
                mensajeEl.textContent = '';
            }, 5000);
        } else {
            mostrarMensaje(`❌ Error: ${resultado.error}`, 'error');
        }
    });

    function mostrarMensaje(texto, tipo = 'info') {
        mensajeEl.textContent = texto;
        mensajeEl.className = `mensaje mensaje-${tipo}`;
    }

    function estadoCargando(cargando) {
        submitBtn.disabled = cargando;
        submitBtn.textContent = cargando ? '⏳ Procesando...' : 'Registrarse';
    }
});
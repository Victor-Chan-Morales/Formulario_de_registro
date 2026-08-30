const reglas = [
    // Validar campos vacíos
    {
        chequeo: (datos) => datos.nombre?.trim() !== '',
        mensaje: "El nombre es requerido."
    },
    {
        chequeo: (datos) => datos.apellidos?.trim() !== '',
        mensaje: "Los apellidos son requeridos."
    },
    {
        chequeo: (datos) => datos.correo?.trim() !== '',
        mensaje: "El correo es requerido."
    },
    {
        chequeo: (datos) => datos.password?.trim() !== '',
        mensaje: "La contraseña es requerida."
    },
    {
        chequeo: (datos) => datos.confirmPassword?.trim() !== '',
        mensaje: "Debes confirmar la contraseña."
    },
    {
        chequeo: (datos) => datos.edad && datos.edad > 0,
        mensaje: "La edad es requerida."
    },
    // Validar estructura de correo
    {
        chequeo: (datos) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo),
        mensaje: "El formato del correo no es válido. Ejemplo: usuario@dominio.com"
    },
    // Validar coincidencia de contraseñas
    {
        chequeo: (datos) => datos.password === datos.confirmPassword,
        mensaje: "Las contraseñas no coinciden."
    },
    // Validar requisitos de contraseña
    {
        chequeo: (datos) => datos.password.length >= 8,
        mensaje: "La contraseña debe tener al menos 8 caracteres."
    },
    {
        chequeo: (datos) => /[A-Z]/.test(datos.password),
        mensaje: "La contraseña debe contener al menos una mayúscula."
    },
    {
        chequeo: (datos) => /[0-9]/.test(datos.password),
        mensaje: "La contraseña debe contener al menos un número."
    },
    // Validar edad
    {
        chequeo: (datos) => datos.edad >= 18,
        mensaje: "Debes ser mayor de 18 años para registrarte."
    }
];

export const validarDatos = (datos) => {
    for (let regla of reglas) {
        if (!regla.chequeo(datos)) {
            return { esValido: false, error: regla.mensaje };
        }
    }
    return { esValido: true, error: null };
};
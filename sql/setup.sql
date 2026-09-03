-- =============================================================
-- setup.sql — Esquema PostgreSQL (sin Supabase)
-- Ejecuta este script una vez en tu base de datos de Railway
-- =============================================================

-- Extensión para generar UUIDs automáticamente
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla principal de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          TEXT NOT NULL CHECK (nombre ~ '^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$'),
    apellidos       TEXT NOT NULL CHECK (apellidos ~ '^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$'),
    edad            INTEGER NOT NULL CHECK (edad >= 18 AND edad <= 100),
    correo          TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    -- Token único que se envía por correo para verificar la cuenta
    token_verificacion  TEXT UNIQUE,
    verificado      BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda rápida por correo (login futuro)
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);

-- Índice para búsqueda rápida por token (verificación de correo)
CREATE INDEX IF NOT EXISTS idx_usuarios_token ON usuarios(token_verificacion);
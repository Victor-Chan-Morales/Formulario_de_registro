# Formulario_de_registro
Formulario de registro como parte de una actividad en el curso de Ingenieria de Software 1

## Miembros del equipo 
### Victor Morales
### Rodrigo Perez
### Andrés Mazariegos

## Estrucutra del entregable
### Diagrama de clases => Diagrama_clases.md
### Evidencias => Evidencia del Trabajo.pdf

## Ejecución local

1. Copia `.env.example` como `.env` y completa las variables de Supabase.
2. Instala las dependencias con `npm install`.
3. Inicia el servidor con `npm run dev`.

Las variables de `.env` no deben subirse al repositorio. La clave `anon` puede llegar al navegador, por lo que el acceso debe protegerse mediante las políticas RLS de Supabase. Nunca uses una clave `service_role` en este frontend.

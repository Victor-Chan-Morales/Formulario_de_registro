// Para desarrollo: reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://ruggcudnogiaqvabrxka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z2djdWRub2dpYXF2YWJyeGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNDU4NzIsImV4cCI6MjEwMzYyMTg3Mn0.wTS1l5EM6EuajyBb7ak4ayJwRZrVfb6BR8tUJLE9hX0';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: Variables de Supabase no configuradas. Verifica tu archivo .env');
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
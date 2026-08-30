-- 1. Crear la tabla pública para almacenar los datos del usuario
CREATE TABLE public.perfiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    correo TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    edad INTEGER NOT NULL
);

-- Habilitar Row Level Security (RLS) por seguridad
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden leer su propio perfil" ON public.perfiles
    FOR SELECT USING (auth.uid() = id);

-- 2. Crear la función del Trigger
CREATE OR REPLACE FUNCTION public.crear_perfil_usuario()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (id, correo, nombre, apellidos, edad)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'nombre',
        NEW.raw_user_meta_data->>'apellidos',
        CAST(NEW.raw_user_meta_data->>'edad' AS INTEGER)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el Trigger que escucha el registro en auth.users
CREATE TRIGGER despues_registro_usuario
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.crear_perfil_usuario();
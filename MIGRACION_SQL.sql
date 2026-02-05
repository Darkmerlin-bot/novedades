-- =====================================================
-- MIGRACIÓN A SUPABASE AUTH - PASO A PASO
-- =====================================================
-- IMPORTANTE: Ejecutar en orden, sección por sección
-- NO ejecutar todo de una vez
-- =====================================================

-- =====================================================
-- PASO 1: CREAR TABLA DE PERFILES
-- (Ejecutar primero)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- =====================================================
-- PASO 2: TRIGGER PARA AUTO-CREAR PERFIL
-- (Ejecutar después del paso 1)
-- =====================================================

-- Función que crea perfil automáticamente cuando se registra usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)), 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe (para poder recrearlo)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PASO 3: AGREGAR COLUMNAS A NOVEDADES (sin borrar nada)
-- (Ejecutar después del paso 2)
-- =====================================================

-- Agregar columnas booleanas para los checks
ALTER TABLE novedades ADD COLUMN IF NOT EXISTS actuacion_realizada BOOLEAN DEFAULT FALSE;
ALTER TABLE novedades ADD COLUMN IF NOT EXISTS criminalistico_realizado BOOLEAN DEFAULT FALSE;
ALTER TABLE novedades ADD COLUMN IF NOT EXISTS pericial_realizado BOOLEAN DEFAULT FALSE;
ALTER TABLE novedades ADD COLUMN IF NOT EXISTS croquis_realizado BOOLEAN DEFAULT FALSE;

-- Migrar datos del JSON 'checks' a las nuevas columnas booleanas
UPDATE novedades SET 
  actuacion_realizada = COALESCE((checks->>'actuacionRealizada')::boolean, false),
  criminalistico_realizado = COALESCE((checks->>'criminalisticoRealizado')::boolean, false),
  pericial_realizado = COALESCE((checks->>'pericialRealizado')::boolean, false),
  croquis_realizado = COALESCE((checks->>'croquisRealizado')::boolean, false)
WHERE checks IS NOT NULL;

-- =====================================================
-- PASO 4: AGREGAR COLUMNAS A LOGS
-- (Ejecutar después del paso 3)
-- =====================================================

ALTER TABLE logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE logs ADD COLUMN IF NOT EXISTS user_email TEXT;

-- =====================================================
-- PASO 5: HABILITAR ROW LEVEL SECURITY (RLS)
-- ⚠️ EJECUTAR SOLO DESPUÉS DE CREAR LOS USUARIOS EN AUTH
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 6: POLÍTICAS DE SEGURIDAD PARA PROFILES
-- =====================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Usuarios autenticados ven perfiles" ON profiles;
DROP POLICY IF EXISTS "Usuarios editan su perfil" ON profiles;
DROP POLICY IF EXISTS "Admins pueden todo en profiles" ON profiles;

-- Crear políticas
CREATE POLICY "Usuarios autenticados ven perfiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios editan su perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins pueden todo en profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- PASO 7: POLÍTICAS DE SEGURIDAD PARA NOVEDADES
-- =====================================================

DROP POLICY IF EXISTS "Ver novedades" ON novedades;
DROP POLICY IF EXISTS "Crear novedades" ON novedades;
DROP POLICY IF EXISTS "Editar novedades" ON novedades;
DROP POLICY IF EXISTS "Solo admin elimina novedades" ON novedades;

CREATE POLICY "Ver novedades" ON novedades
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Crear novedades" ON novedades
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Editar novedades" ON novedades
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin elimina novedades" ON novedades
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- PASO 8: POLÍTICAS DE SEGURIDAD PARA LOGS
-- =====================================================

DROP POLICY IF EXISTS "Solo admin ve logs" ON logs;
DROP POLICY IF EXISTS "Usuarios crean logs" ON logs;

CREATE POLICY "Solo admin ve logs" ON logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Usuarios crean logs" ON logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- PASO 9: DESPUÉS DE CREAR USUARIOS, ACTUALIZAR ADMINS
-- Reemplaza 'admin@novedades.local' con el email de tu admin
-- =====================================================

-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@novedades.local';

-- =====================================================
-- VERIFICACIÓN FINAL
-- Ejecuta esto para verificar que todo está bien
-- =====================================================

-- SELECT * FROM profiles;
-- SELECT table_name, row_security FROM information_schema.tables WHERE table_schema = 'public';


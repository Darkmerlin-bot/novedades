-- =====================================================
-- SISTEMA DE NOVEDADES - SCRIPT DE BASE DE DATOS
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor
-- =====================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de novedades
CREATE TABLE IF NOT EXISTS novedades (
    id BIGSERIAL PRIMARY KEY,
    numero_novedad TEXT NOT NULL,
    numero_sgsp TEXT NOT NULL,
    "informeActuacion" TEXT,
    "informeCriminalistico" TEXT,
    "informePericial" TEXT,
    croquis TEXT,
    checks JSONB DEFAULT '{}',
    creado_por TEXT,
    modificado_por TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración
CREATE TABLE IF NOT EXISTS config (
    id BIGSERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logs (registro de actividades)
CREATE TABLE IF NOT EXISTS logs (
    id BIGSERIAL PRIMARY KEY,
    username TEXT,
    nombre TEXT,
    action TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE ACCESO
-- =====================================================
-- Nota: Estas políticas permiten acceso público para desarrollo
-- Para producción, deberías implementar autenticación de Supabase

-- Políticas para users
DROP POLICY IF EXISTS "Allow all users" ON users;
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);

-- Políticas para novedades
DROP POLICY IF EXISTS "Allow all novedades" ON novedades;
CREATE POLICY "Allow all novedades" ON novedades FOR ALL USING (true) WITH CHECK (true);

-- Políticas para config
DROP POLICY IF EXISTS "Allow all config" ON config;
CREATE POLICY "Allow all config" ON config FOR ALL USING (true) WITH CHECK (true);

-- Políticas para logs
DROP POLICY IF EXISTS "Allow all logs" ON logs;
CREATE POLICY "Allow all logs" ON logs FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_novedades_created ON novedades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at DESC);

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================
SELECT 'Base de datos configurada correctamente!' AS mensaje;

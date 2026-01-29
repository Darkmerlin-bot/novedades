# 📋 Sistema de Novedades

Sistema de gestión de novedades con autenticación de usuarios, registro de actividades y base de datos en Supabase.

## 🚀 Configuración

### Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Clic en **"New Project"**
3. Elige un nombre y contraseña para tu proyecto
4. Espera a que se cree (1-2 minutos)

### Paso 2: Crear las tablas

Ve a **SQL Editor** en el panel izquierdo y ejecuta este código:

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de novedades
CREATE TABLE novedades (
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
CREATE TABLE config (
    id BIGSERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logs
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    username TEXT,
    nombre TEXT,
    action TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para desarrollo)
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON novedades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON logs FOR ALL USING (true) WITH CHECK (true);
```

### Paso 3: Obtener credenciales

1. Ve a **Settings** → **API** en Supabase
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public key** (empieza con `eyJ...`)

### Paso 4: Configurar el proyecto

Abre el archivo `index.html` y busca estas líneas al principio del script:

```javascript
const SUPABASE_URL = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
```

Reemplázalas con tus credenciales:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...';
```

### Paso 5: Subir a GitHub Pages

1. Crea un nuevo repositorio en GitHub
2. Sube el archivo `index.html`
3. Ve a **Settings** → **Pages**
4. En **Source** selecciona `main` branch
5. Guarda y espera 1-2 minutos
6. Tu app estará en: `https://tu-usuario.github.io/tu-repo/`

---

## 🔐 Credenciales por defecto

- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 📱 Funcionalidades

- ✅ Sistema de login con usuarios y roles
- ✅ Crear, editar y eliminar novedades
- ✅ Asignación de personal por categoría
- ✅ Casillas de verificación de tareas
- ✅ Gestión de usuarios (solo admin)
- ✅ Configuración de nombres (solo admin)
- ✅ Registro de todas las actividades
- ✅ Estadísticas
- ✅ Cambio de contraseña
- ✅ Base de datos en la nube (Supabase)
- ✅ Funciona en cualquier dispositivo

---

## 🛠️ Tecnologías

- HTML5, CSS3, JavaScript
- Supabase (PostgreSQL)
- GitHub Pages (hosting gratuito)

---

## 📄 Licencia

Uso libre para proyectos personales y comerciales.

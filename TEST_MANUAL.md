# 🧪 Guía de Prueba Manual - South Park Reservas

## ✅ Checklist Pre-Prueba

Antes de empezar, verifica que tienes:
- [ ] PostgreSQL instalado y corriendo (o cuenta en Supabase)
- [ ] Node.js instalado (v20+)
- [ ] Archivo `.env` configurado con DATABASE_URL

---

## 🚀 PASO 1: Verificar Base de Datos

### Opción A: ¿Ya tienes PostgreSQL local?
```bash
# Verifica que esté corriendo
# Windows:
services.msc 
# Busca "postgresql" y verifica que esté "Ejecutándose"

# Si no está instalado, ve a:
# https://www.postgresql.org/download/windows/
```

### Opción B: Usar Supabase (Más rápido)
```bash
1. Ve a: https://supabase.com
2. Sign up (gratis)
3. New Project → Espera 2 minutos
4. Settings → Database → Connection String
5. Copia la "Connection string" (la que dice URI)
```

---

## 🔧 PASO 2: Configurar .env

Crea un archivo `.env` en la RAÍZ del proyecto (no en backend):

### Si usas PostgreSQL local:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/southpark_reservas?schema=public"
JWT_SECRET="southpark-secret-2024"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

### Si usas Supabase:
```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-REF].supabase.co:5432/postgres"
JWT_SECRET="southpark-secret-2024"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

---

## 📦 PASO 3: Instalar y Configurar Backend

Abre PowerShell o CMD en la carpeta del proyecto:

```powershell
# 1. Entrar a la carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Generar cliente de Prisma
npm run prisma:generate

# 4. Crear las tablas (migraciones)
npm run prisma:migrate
# Cuando pregunte el nombre, escribe: init

# 5. Poblar con datos de ejemplo
npm run prisma:seed

# 6. Probar conexión
node test-conexion.js
```

### ✅ Deberías ver:
```
✅ Conexión exitosa a la base de datos!
📊 Canchas en la BD: 6
✅ Canchas encontradas:
   - Cancha de Voley 1 (VOLEY_PLAYA)
   - Cancha de Voley 2 (VOLEY_PLAYA)
   - Cancha de Voley 3 (VOLEY_PLAYA)
   - Cancha de Voley 4 (VOLEY_PLAYA)
   - Mini Golf - Circuito 1 (MINI_GOLF)
   - Mini Golf - Circuito 2 (MINI_GOLF)
✅ Todo listo para empezar!
```

---

## 🖥️ PASO 4: Iniciar Backend

```powershell
# En la carpeta backend
npm run dev
```

### ✅ Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
📝 Environment: development
✅ API disponible en: http://localhost:3000/
🏥 Health check: http://localhost:3000/health
```

**¡Déjalo corriendo! No cierres esta terminal.**

---

## 🎨 PASO 5: Instalar y Iniciar Frontend

Abre OTRA terminal (PowerShell o CMD):

```powershell
# Volver a la raíz del proyecto
cd ..

# Si estabas en backend:
cd ..

# Instalar dependencias del frontend
npm install

# Iniciar el frontend
npm run dev
```

### ✅ Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🧪 PASO 6: Pruebas

### Prueba 1: Verificar Backend
En tu navegador, abre:
- http://localhost:3000

**Deberías ver:**
```json
{
  "message": "🏐 South Park Reservas API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "auth": "/api/auth",
    "canchas": "/api/canchas",
    "disponibilidad": "/api/disponibilidad",
    "reservas": "/api/reservas"
  }
}
```

### Prueba 2: Ver las Canchas
Abre: http://localhost:3000/api/canchas

**Deberías ver:** Un JSON con las 6 canchas (4 voley + 2 mini golf)

### Prueba 3: Abrir el Frontend
Abre: http://localhost:5173

**Deberías ver:** Tu página de South Park con el diseño bonito

### Prueba 4: Hacer una Reserva
1. En http://localhost:5173, scroll hasta "Reservá tu Turno"
2. **Seleccionar Cancha**: Elige "Cancha de Voley 1"
3. **Fecha**: Selecciona mañana o pasado
4. **Hora**: Debería aparecer un dropdown con horas disponibles (16:00, 17:00, etc.)
5. **Duración**: Selecciona "2 horas"
6. **Personas**: Pon 8
7. **Nombre**: Tu nombre
8. **Email**: tu@email.com
9. **Teléfono**: +57 300 123 4567
10. Click en **"Crear Reserva"**

### ✅ Si todo funciona:
- Verás una página de confirmación
- Mostrará el precio (debería ser $110.000 si es entre 4-8pm, o $130.000 si es 8-12am)
- Mostrará la seña (30% del total)

---

## 🔍 PASO 7: Ver la Reserva en la Base de Datos

En la terminal del backend:

```powershell
# Abrir Prisma Studio
npm run prisma:studio
```

Se abrirá http://localhost:5555

1. Click en **"Reserva"** en el menú izquierdo
2. Deberías ver tu reserva recién creada
3. Verifica que tenga:
   - ✅ Estado: PENDIENTE
   - ✅ Precio correcto
   - ✅ Seña calculada (30%)
   - ✅ Tus datos

---

## 🐛 Solución de Problemas Comunes

### Error: "Can't reach database server"
```powershell
# Verifica que PostgreSQL esté corriendo
services.msc

# O verifica tu URL de Supabase en .env
```

### Error: "Port 3000 is already in use"
```powershell
# Opción 1: Cerrar lo que usa el puerto
netstat -ano | findstr :3000
# Anota el PID y:
taskkill /PID [número] /F

# Opción 2: Cambiar puerto en .env
PORT=3001
```

### Las canchas no aparecen en el frontend
```powershell
# Verifica que el backend esté corriendo
# Ve a: http://localhost:3000/api/canchas
# Si da error, revisa la consola del backend
```

### Error: "Cannot find module @prisma/client"
```powershell
cd backend
npm run prisma:generate
```

### El formulario no muestra horarios
- Primero selecciona una cancha
- Luego selecciona una fecha
- Los horarios aparecen automáticamente
- Si no aparecen, verifica la consola del navegador (F12)

---

## 📊 Resumen de URLs

| Servicio | URL | ¿Qué hace? |
|----------|-----|------------|
| Backend API | http://localhost:3000 | API REST |
| Frontend | http://localhost:5173 | Sitio web |
| Prisma Studio | http://localhost:5555 | Ver base de datos |
| API Canchas | http://localhost:3000/api/canchas | Ver canchas disponibles |

---

## ✅ Checklist Final

- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Las 6 canchas aparecen en la API
- [ ] El formulario de reservas carga correctamente
- [ ] Puedo seleccionar una cancha
- [ ] Aparecen horarios disponibles
- [ ] El precio se calcula automáticamente
- [ ] Puedo crear una reserva
- [ ] Veo la página de confirmación
- [ ] La reserva aparece en Prisma Studio

---

## 🎉 ¡Si todo funciona!

Ya tenés el sistema operativo. Las próximas funcionalidades serían:

1. **Panel de Admin** - Para gestionar las reservas
2. **Login/Registro** - Para que los usuarios tengan cuenta
3. **Mis Reservas** - Para que los clientes vean su historial
4. **Pagos Online** - Para recibir señas automáticamente

**¿Algún paso no funcionó?** Avísame en qué paso te trabaste y te ayudo a solucionarlo.


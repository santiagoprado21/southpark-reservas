# 🚀 Setup con Neon - South Park Reservas

## 📋 Paso 1: Crear Base de Datos en Neon

### 1. Crear cuenta en Neon
1. Ve a: https://neon.tech
2. Click en **"Sign Up"** 
3. Puedes registrarte con GitHub o Google (más rápido)
4. Es **100% gratis** para el plan básico

### 2. Crear un Proyecto
1. Una vez dentro, click en **"Create a project"**
2. **Project name**: `southpark-reservas` (o el nombre que quieras)
3. **Region**: Elige el más cercano (ej: US East o South America)
4. **PostgreSQL version**: Deja la versión por defecto (15 o 16)
5. Click en **"Create project"**

### 3. Copiar la Connection String
Apenas se cree el proyecto, verás una pantalla con la **Connection String**.

**Busca la que dice "Pooled connection" o "Connection string"**

Se ve algo así:
```
postgresql://usuario:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANTE**: Copia TODA la URL completa. La necesitarás en el siguiente paso.

**💡 TIP**: Si cierras la ventana, puedes volver a verla en:
- Dashboard → Tu proyecto → Connection Details → Connection string

---

## 📝 Paso 2: Configurar Variables de Entorno

### Crear archivo `.env` en la RAÍZ del proyecto

Crea un archivo llamado `.env` en la raíz (donde está el `package.json`):

```env
# Pega tu connection string de Neon aquí
DATABASE_URL="postgresql://usuario:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Configuración JWT
JWT_SECRET="southpark-secret-2024"
JWT_EXPIRES_IN="7d"

# URLs
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

**🔴 Reemplaza** la línea de `DATABASE_URL` con tu URL completa de Neon.

---

## 🔧 Paso 3: Instalar Dependencias del Backend

Abre **PowerShell** o **CMD** en la carpeta del proyecto:

```powershell
cd backend
npm install
```

Espera a que termine (puede tomar 1-2 minutos).

---

## 🗄️ Paso 4: Crear las Tablas en Neon

Ahora vamos a crear todas las tablas en la base de datos de Neon:

```powershell
# 1. Generar el cliente de Prisma
npm run prisma:generate

# 2. Crear las tablas (migraciones)
npm run prisma:migrate

# Cuando pregunte: "Enter a name for the new migration"
# Escribe: init
# Presiona Enter
```

**✅ Deberías ver:**
```
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

---

## 🌱 Paso 5: Poblar con Datos de Ejemplo

Ahora vamos a crear las 6 canchas, usuarios de prueba y configuración de precios:

```powershell
npm run prisma:seed
```

**✅ Deberías ver:**
```
🌱 Iniciando seed de la base de datos...
👤 Creando usuarios...
✅ Usuario Admin creado: admin@southpark.com
✅ Usuario Cliente creado: cliente@ejemplo.com
🏐 Creando canchas de Voley Playa...
✅ Cancha de Voley 1 creada con configuración de precios
✅ Cancha de Voley 2 creada con configuración de precios
✅ Cancha de Voley 3 creada con configuración de precios
✅ Cancha de Voley 4 creada con configuración de precios
⛳ Creando circuitos de Mini Golf...
✅ Mini Golf - Circuito 1 creado con configuración de precios
✅ Mini Golf - Circuito 2 creado con configuración de precios
📅 Creando reservas de ejemplo...
✅ Seed completado exitosamente!

📝 Resumen:
   - 2 usuarios
   - 6 canchas
   - 3 reservas
   - 1 bloqueos
   - 4 configuraciones
```

---

## 🧪 Paso 6: Verificar la Conexión

```powershell
node test-conexion.js
```

**✅ Deberías ver:**
```
🔍 Verificando conexión a la base de datos...

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

## 🚀 Paso 7: Iniciar el Backend

```powershell
npm run dev
```

**✅ Deberías ver:**
```
🚀 Servidor corriendo en http://localhost:3000
📝 Environment: development
✅ API disponible en: http://localhost:3000/
🏥 Health check: http://localhost:3000/health
```

**🟢 Déjalo corriendo** - No cierres esta terminal.

---

## 🎨 Paso 8: Instalar e Iniciar el Frontend

Abre **OTRA terminal** (PowerShell o CMD):

```powershell
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias
npm install

# Iniciar frontend
npm run dev
```

**✅ Deberías ver:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Paso 9: ¡PROBAR TODO!

### Prueba 1: Backend API
Abre en tu navegador: **http://localhost:3000**

Deberías ver:
```json
{
  "message": "🏐 South Park Reservas API",
  "version": "1.0.0",
  "status": "running"
}
```

### Prueba 2: Ver las Canchas
Abre: **http://localhost:3000/api/canchas**

Deberías ver un JSON con las 6 canchas (4 voley + 2 mini golf).

### Prueba 3: Frontend
Abre: **http://localhost:5173**

Deberías ver tu sitio web de South Park con todo el diseño.

### Prueba 4: Hacer una Reserva
1. Scroll hasta **"Reservá tu Turno"**
2. **Cancha**: Selecciona "Cancha de Voley 1"
3. **Fecha**: Elige mañana o pasado
4. **Hora**: Selecciona "18:00" (debería aparecer en el dropdown)
5. **Duración**: Selecciona "2 horas"
6. **Personas**: Pon 8
7. Completa tus datos (nombre, email, teléfono)
8. Click en **"Crear Reserva"**

**✅ Si funciona:**
- Verás una página de confirmación
- Te mostrará el precio: **$110,000** (Happy Hour de 4-8pm)
- La seña será: **$33,000** (30%)

### Prueba 5: Ver la Reserva en Neon
1. Ve a: https://neon.tech
2. Abre tu proyecto "southpark-reservas"
3. Click en **"Tables"** en el menú lateral
4. Click en la tabla **"reservas"**
5. Deberías ver tu reserva recién creada

### Prueba 6: Ver con Prisma Studio (Más fácil)
En la terminal del backend:
```powershell
npm run prisma:studio
```

Se abrirá: **http://localhost:5555**
- Click en "Reserva" → Verás tu reserva
- Click en "Cancha" → Verás las 6 canchas
- Click en "User" → Verás los usuarios

---

## 🎉 ¡LISTO!

Si llegaste hasta aquí y todo funcionó:

✅ Backend conectado a Neon  
✅ 6 canchas configuradas (4 voley + 2 mini golf)  
✅ Precios configurados con Happy Hour  
✅ Sistema de reservas funcionando  
✅ Frontend conectado al backend  

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
```powershell
# Verifica tu .env:
# 1. Asegúrate de que la URL de Neon esté completa
# 2. Debe terminar con ?sslmode=require
# 3. No debe tener espacios al inicio o final
```

### Error: "Environment variable not found: DATABASE_URL"
```powershell
# El archivo .env debe estar en la RAÍZ, no en backend
# Estructura correcta:
# SouthParkReservas/
#   ├── .env          ← AQUÍ
#   ├── backend/
#   ├── src/
#   └── package.json
```

### Los horarios no aparecen en el formulario
- Primero selecciona una **cancha**
- Luego selecciona una **fecha**
- Los horarios se cargan automáticamente
- Revisa la consola del navegador (F12) para ver errores

### Error: "Port 3000 is already in use"
```powershell
# Cambiar puerto en .env:
PORT=3001

# O cerrar lo que use el puerto 3000
```

---

## 💡 Ventajas de Neon

✅ **Gratis** hasta 500MB (suficiente para empezar)  
✅ **Auto-scaling** (se apaga cuando no lo usas)  
✅ **Backups automáticos**  
✅ **SSL por defecto**  
✅ **Branching** (como git para bases de datos)  

---

## 📊 Próximos Pasos

Ahora que todo funciona, podemos:

1. **Panel de Administración** 
   - Ver todas las reservas
   - Confirmar/cancelar reservas
   - Gestionar canchas

2. **Autenticación en Frontend**
   - Login para administradores
   - Área de usuario

3. **Sistema de Pagos**
   - Integrar Wompi, PayU o MercadoPago
   - Recibir señas automáticamente

---

¿Todo funcionó? ¿En qué paso estás? 🚀


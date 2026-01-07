# 🚀 Despliegue en Render - Guía Paso a Paso

## Parte 1: Preparación (5 minutos)

### 1. Subir Código a GitHub

Si aún no lo has hecho:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparar para producción"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/southpark-reservas.git
git branch -M main
git push -u origin main
```

---

## Parte 2: Desplegar Backend en Render (15 minutos)

### Paso 1: Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Click en **"Get Started for Free"**
3. Regístrate con GitHub (recomendado)

### Paso 2: Crear Nuevo Web Service

1. En el Dashboard de Render, click **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub
   - Busca: `southpark-reservas`
   - Click **"Connect"**

### Paso 3: Configurar el Servicio

**Configuración Básica:**

```
Name: southpark-backend
Region: Oregon (US West) o la más cercana
Branch: main
Root Directory: backend
```

**Build & Deploy:**

```
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

**Plan:**
```
Instance Type: Free (seleccionar)
```

### Paso 4: Configurar Variables de Entorno ⚡

**¡Importante! Antes de hacer Deploy, configura estas variables:**

En la sección **"Environment"** o **"Environment Variables"**, agrega:

#### 1. DATABASE_URL
```
Key: DATABASE_URL
Value: [Tu URL de Neon PostgreSQL]
```
**Dónde conseguirla:**
- Ve a [console.neon.tech](https://console.neon.tech)
- Selecciona tu proyecto
- Ve a "Connection Details"
- Copia la **Connection String**
- Ejemplo: `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

#### 2. JWT_SECRET
```
Key: JWT_SECRET
Value: [Genera una clave secreta fuerte]
```
**Cómo generar una segura:**
En tu terminal local:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
O usa: `southpark-jwt-secret-2024-production-super-secure-key`

#### 3. JWT_EXPIRES_IN
```
Key: JWT_EXPIRES_IN
Value: 7d
```

#### 4. NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### 5. FRONTEND_URL
```
Key: FRONTEND_URL
Value: [Lo configuraremos después, por ahora pon]:
Value: *
```
**Nota:** Lo actualizaremos cuando despleguemos el frontend.

#### 6. PORT (Render lo configura automáticamente, pero agrégalo)
```
Key: PORT
Value: 3000
```

### Paso 5: Desplegar

1. Revisa que todas las variables estén configuradas
2. Click en **"Create Web Service"**
3. Espera 3-5 minutos mientras Render:
   - Instala dependencias
   - Genera Prisma Client
   - Compila TypeScript
   - Inicia el servidor

### Paso 6: Verificar el Despliegue

Una vez que termine:

1. Verás un mensaje: **"Your service is live"** 🎉
2. Render te dará una URL como: `https://southpark-backend.onrender.com`
3. Prueba la URL en tu navegador:
   ```
   https://southpark-backend.onrender.com
   ```
   Deberías ver:
   ```json
   {
     "message": "🏐 South Park Reservas API",
     "version": "1.0.0",
     "status": "running"
   }
   ```

---

## Parte 3: Desplegar Frontend en Vercel (10 minutos)

### Paso 1: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Sign Up"**
3. Regístrate con GitHub

### Paso 2: Importar Proyecto

1. Click en **"Add New..."** → **"Project"**
2. Importa tu repositorio `southpark-reservas`
3. Click en **"Import"**

### Paso 3: Configurar el Proyecto

**Framework Preset:** Vite (se detecta automáticamente)

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Root Directory:** `./` (raíz del proyecto)

### Paso 4: Configurar Variable de Entorno

En **"Environment Variables"**, agrega:

```
Key: VITE_API_URL
Value: https://southpark-backend.onrender.com
```
(Usa la URL que te dio Render en el paso anterior)

### Paso 5: Desplegar

1. Click en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Listo! 🎉

Vercel te dará una URL como: `https://southpark-reservas.vercel.app`

---

## Parte 4: Conectar Frontend y Backend (5 minutos)

### Paso 1: Actualizar CORS en Backend

Vuelve a **Render** y actualiza la variable de entorno:

```
Key: FRONTEND_URL
Value: https://southpark-reservas.vercel.app
```
(Usa la URL que te dio Vercel)

**Importante:** Después de cambiar la variable, Render reiniciará automáticamente el servicio.

### Paso 2: Probar la Conexión

1. Ve a tu frontend: `https://southpark-reservas.vercel.app`
2. Intenta hacer una reserva
3. Si funciona: ¡TODO ESTÁ LISTO! 🎉

---

## Parte 5: Configuración Inicial de Producción (10 minutos)

### Paso 1: Crear Usuario Administrador

En tu computadora local, conecta a la base de datos de producción:

1. Ve a tu proyecto en Render
2. En la sección **"Shell"**, click **"Connect"** (abrirá una terminal)
3. O conecta desde tu local actualizando el `.env`:

```bash
# Temporal - para crear admin
DATABASE_URL="[tu-url-de-neon-produccion]"

cd backend
node create-admin-prod.js
```

Ingresa:
- **Nombre:** Administrador South Park
- **Email:** admin@southpark.com (o el que prefieras)
- **Contraseña:** [Una contraseña SEGURA]

**¡GUARDA ESTAS CREDENCIALES!**

### Paso 2: Verificar Datos

Ve a Prisma Studio para verificar que todo esté bien:

```bash
npx prisma studio
```

Revisa:
- ✅ Usuario admin creado
- ✅ 4 canchas de Voley Playa
- ✅ 2 circuitos de Mini Golf
- ✅ Configuraciones de precios

---

## 🎉 ¡Listo para Producción!

### URLs Finales:

**Frontend (Público):**
```
https://southpark-reservas.vercel.app
```

**Backend (API):**
```
https://southpark-backend.onrender.com
```

**Panel de Admin:**
```
https://southpark-reservas.vercel.app/admin
```

### Credenciales del Admin:
```
Email: [el que configuraste]
Contraseña: [la que configuraste]
```

---

## 📱 Prueba Final

### 1. Desde un Celular:

1. Abre el sitio web
2. Haz una reserva de prueba
3. Verifica que se abra WhatsApp

### 2. Como Admin:

1. Entra al panel de admin
2. Ve las reservas
3. Confirma la reserva de prueba
4. Genera un reporte PDF

**Si todo funciona:** ¡Estás listo para entregar al club! 🚀

---

## 🆘 Problemas Comunes

### Error: "Application failed to respond"
- **Causa:** El backend no inició correctamente
- **Solución:** Ve a Render → Logs y revisa los errores
- **Común:** Falta variable de entorno DATABASE_URL

### Error: "Network Error" en frontend
- **Causa:** CORS o URL incorrecta
- **Solución:** Verifica que FRONTEND_URL esté bien configurado en Render

### Backend muy lento (primer request)
- **Causa:** Render Free Tier "duerme" después de 15 min sin uso
- **Solución:** Normal en plan Free. Primera carga tarda 30-60 segundos

### Error: "Failed to fetch"
- **Causa:** VITE_API_URL mal configurado
- **Solución:** Ve a Vercel → Settings → Environment Variables → Verifica la URL

---

## 💡 Tips para Render Free Tier

1. **El servicio se "duerme" después de 15 minutos sin uso**
   - Primera carga será lenta (30-60 segundos)
   - Después funciona normal

2. **750 horas gratis al mes**
   - Suficiente para un negocio pequeño
   - Si necesitas 24/7, considera el plan de $7/mes

3. **Auto-deploys**
   - Cada push a `main` en GitHub desplegará automáticamente

4. **Logs en tiempo real**
   - Ve a Render → Tu servicio → Logs
   - Útil para debuggear

---

## 🎯 Próximo Paso

**Entregar al club con:**
- ✅ URLs de producción
- ✅ Credenciales de admin
- ✅ `MANUAL_USUARIO.md`
- ✅ Número de soporte

**¡El sistema está en producción y listo para usar!** 🎉


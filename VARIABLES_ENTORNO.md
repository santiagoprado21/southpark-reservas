# 🔐 Variables de Entorno - Referencia Rápida

## Backend (Render)

### Cómo Agregar Variables en Render:

1. En tu servicio en Render
2. Ve a la pestaña **"Environment"** (lado izquierdo)
3. En la sección **"Environment Variables"**
4. Click en **"Add Environment Variable"**
5. Ingresa Key y Value
6. Click **"Save Changes"**

---

### Variables Requeridas:

#### 1. DATABASE_URL
```
DATABASE_URL=postgresql://[user]:[password]@[host]/[db]?sslmode=require
```
**Dónde obtenerla:**
- Neon Console → Tu proyecto → Connection Details → Connection String
- **Ejemplo real:**
  ```
  postgresql://neondb_owner:abc123@ep-odd-heart-a4cb98ei.us-east-1.aws.neon.tech/neondb?sslmode=require
  ```

---

#### 2. JWT_SECRET
```
JWT_SECRET=tu-clave-super-secreta-y-larga-de-minimo-32-caracteres
```
**Cómo generar una segura:**

Opción 1 - En terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Opción 2 - Manual (ejemplo):
```
JWT_SECRET=southpark2024_produccion_jwt_secret_muy_seguro_abc123xyz789
```

**⚠️ IMPORTANTE:** Usa una diferente en producción que en desarrollo.

---

#### 3. JWT_EXPIRES_IN
```
JWT_EXPIRES_IN=7d
```
**Significado:** Los tokens de login duran 7 días.

---

#### 4. NODE_ENV
```
NODE_ENV=production
```
**Importante:** Esto activa optimizaciones y modo producción.

---

#### 5. FRONTEND_URL
```
FRONTEND_URL=https://southpark-reservas.vercel.app
```
**⚠️ ACTUALIZAR después de desplegar frontend:**
- Primero pon `*` (permite todos)
- Después del deploy de Vercel, actualiza con la URL real
- Esto configura CORS correctamente

---

#### 6. PORT (Opcional)
```
PORT=3000
```
**Nota:** Render configura esto automáticamente, pero puedes agregarlo para estar seguro.

---

## Frontend (Vercel)

### Cómo Agregar Variables en Vercel:

1. En tu proyecto en Vercel
2. Ve a **"Settings"** (arriba)
3. Click en **"Environment Variables"** (lado izquierdo)
4. Ingresa Name y Value
5. Selecciona **Production, Preview, Development** (todas)
6. Click **"Save"**
7. **Importante:** Después de agregar variables, haz **"Redeploy"**

---

### Variable Requerida:

#### VITE_API_URL
```
VITE_API_URL=https://southpark-backend.onrender.com
```
**⚠️ IMPORTANTE:**
- Usa la URL que te dio Render (sin `/` al final)
- Ejemplo: `https://southpark-backend.onrender.com`
- **NO pongas:** `https://southpark-backend.onrender.com/` (sin slash final)
- **NO pongas:** `https://southpark-backend.onrender.com/api` (sin /api)

**Después de agregar esta variable:**
1. Ve a **"Deployments"**
2. Click en los 3 puntos del último deployment
3. Click **"Redeploy"**

---

## 📋 Checklist de Variables

### Backend en Render:
- [ ] `DATABASE_URL` (de Neon)
- [ ] `JWT_SECRET` (generar uno nuevo)
- [ ] `JWT_EXPIRES_IN` (7d)
- [ ] `NODE_ENV` (production)
- [ ] `FRONTEND_URL` (URL de Vercel, actualizar después)
- [ ] `PORT` (3000, opcional)

### Frontend en Vercel:
- [ ] `VITE_API_URL` (URL de Render)

---

## 🧪 Probar que Funcionan

### Backend:
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

### Frontend:
```
https://southpark-reservas.vercel.app
```
Deberías ver el sitio web funcionando.

### Conexión Frontend-Backend:
1. Abre el sitio web
2. Intenta hacer una reserva
3. Si funciona = ¡TODO BIEN! ✅
4. Si da error = Revisa las variables en la consola del navegador (F12)

---

## 🆘 Errores Comunes

### Error: "PrismaClient failed to initialize"
**Causa:** `DATABASE_URL` mal configurada
**Solución:** Verifica la URL de Neon, debe incluir `?sslmode=require`

### Error: "jwt malformed" o "invalid signature"
**Causa:** `JWT_SECRET` diferente entre backend y cliente
**Solución:** Verifica que sea el mismo en todos lados

### Error: "CORS Error" o "Access-Control-Allow-Origin"
**Causa:** `FRONTEND_URL` mal configurada
**Solución:** Debe ser exactamente la URL de Vercel (sin `/` al final)

### Error: "Network Error" en frontend
**Causa:** `VITE_API_URL` mal configurada
**Solución:** Verifica la URL de Render, y haz **Redeploy** en Vercel

---

## 💡 Tips

1. **No compartas las variables de entorno**
   - Son secretos de producción
   - Especialmente `DATABASE_URL` y `JWT_SECRET`

2. **Usa valores diferentes en desarrollo y producción**
   - JWT_SECRET diferente
   - Base de datos diferente

3. **Si cambias una variable:**
   - Render: Se reinicia automáticamente
   - Vercel: Debes hacer **Redeploy** manualmente

4. **Backup de variables:**
   - Guarda las variables en un lugar seguro
   - Por si necesitas reconfigurar

---

## 📝 Template para Copiar/Pegar

### Render (Backend):
```
DATABASE_URL=postgresql://[COMPLETAR]
JWT_SECRET=[GENERAR UNO NUEVO]
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://[TU-APP].vercel.app
PORT=3000
```

### Vercel (Frontend):
```
VITE_API_URL=https://[TU-APP].onrender.com
```

---

**¿Listo?** Copia estas variables en Render y Vercel y estarás en producción en minutos. 🚀


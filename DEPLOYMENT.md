# 🚀 Guía de Despliegue a Producción - South Park Reservas

## ✅ Checklist Pre-Despliegue

### 1. Base de Datos (Neon PostgreSQL)
- [x] Base de datos configurada en Neon
- [ ] **Crear usuario admin de producción**
- [ ] Verificar que las migraciones estén aplicadas
- [ ] Crear backup inicial
- [ ] Configurar límites de conexión

### 2. Backend (API)

#### Variables de Entorno (`backend/.env.production`)
```env
# Base de datos
DATABASE_URL="postgresql://[user]:[password]@[host]/[db]?sslmode=require"

# JWT
JWT_SECRET="[GENERAR_SECRET_SEGURO_PRODUCCION]"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="production"

# Frontend URL (actualizar con dominio real)
FRONTEND_URL="https://tu-dominio.com"

# WhatsApp (números reales del club)
WHATSAPP_VOLEY="573177751834"
WHATSAPP_MINIGOLF="573147814609"
```

#### Tareas Backend:
- [ ] Generar nuevo JWT_SECRET para producción
- [ ] Actualizar FRONTEND_URL con dominio real
- [ ] Configurar CORS para dominio de producción
- [ ] Verificar logs de errores
- [ ] Configurar límite de rate limiting (opcional)

### 3. Frontend

#### Variables de Entorno (`.env.production`)
```env
VITE_API_URL="https://api.tu-dominio.com"
```

#### Tareas Frontend:
- [ ] Actualizar `VITE_API_URL` con URL real del backend
- [ ] Optimizar imágenes en `/public` y `/src/assets`
- [ ] Verificar que todas las rutas funcionen
- [ ] Probar en diferentes dispositivos móviles
- [ ] Verificar PWA (si aplica)

### 4. Configuraciones de Seguridad

#### Backend:
```typescript
// backend/src/index.ts - Verificar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Agregar helmet para seguridad
import helmet from 'helmet';
app.use(helmet());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por IP
});
app.use('/api/', limiter);
```

- [ ] Instalar y configurar Helmet
- [ ] Configurar rate limiting
- [ ] HTTPS obligatorio
- [ ] Validar todas las entradas con Zod

### 5. Datos Iniciales de Producción

#### Crear usuario admin real:
```bash
cd backend
node create-admin-prod.js
```

**Script `backend/create-admin-prod.js`:**
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@southpark.com'; // Cambiar por email real
  const password = 'CAMBIAR_ESTO'; // Cambiar por contraseña segura
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre: 'Administrador',
      role: 'ADMIN',
      servicioAsignado: 'TODOS',
      activo: true,
    },
  });

  console.log('✅ Admin creado:', email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] Crear script de admin para producción
- [ ] **Cambiar email y contraseña de admin**
- [ ] Crear usuarios empleados reales
- [ ] Verificar configuración de canchas y precios

---

## 🌐 Despliegue Paso a Paso

### Opción A: Despliegue Recomendado (Gratuito/Económico)

#### 1. Backend → **Railway** o **Render**

**Railway (Recomendado):**
1. Crear cuenta en [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Seleccionar repositorio
4. Configurar variables de entorno
5. Agregar comando de inicio:
   ```json
   {
     "build": "npm run build",
     "start": "npm run start"
   }
   ```
6. Railway asignará un dominio: `https://tu-app.up.railway.app`

**Render:**
1. Crear cuenta en [Render.com](https://render.com)
2. New → Web Service
3. Conectar repositorio
4. Build Command: `cd backend && npm install && npm run build`
5. Start Command: `cd backend && npm start`
6. Configurar variables de entorno

#### 2. Frontend → **Vercel** (Recomendado)

1. Crear cuenta en [Vercel.com](https://vercel.com)
2. Import Project → Seleccionar repositorio
3. Framework: Vite
4. Root Directory: `./`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Agregar variable de entorno:
   - `VITE_API_URL`: URL del backend (Railway/Render)
8. Deploy!
9. Vercel asignará dominio: `https://tu-app.vercel.app`

#### 3. Base de Datos → **Neon** (Ya configurado)
- ✅ Ya tienes Neon configurado
- Solo verifica los límites de tu plan

---

### Opción B: Dominio Personalizado (Opcional)

#### Si el club quiere dominio propio:

1. **Comprar dominio** (ej: `southparkreservas.com`)
   - GoDaddy, Namecheap, Google Domains (~$10-15/año)

2. **Configurar DNS:**
   - Frontend: Agregar dominio en Vercel
   - Backend: Agregar dominio en Railway/Render
   - Configurar registros DNS:
     ```
     A     @        -> IP de Vercel
     CNAME www      -> tu-app.vercel.app
     CNAME api      -> tu-api.railway.app
     ```

3. **SSL/HTTPS:** Automático en Vercel y Railway

---

## 📋 Lista de Verificación Final

### Antes del Despliegue:
- [ ] Probar todo localmente una última vez
- [ ] Verificar que no hay errores de consola
- [ ] Probar en móvil (el club usará principalmente celular)
- [ ] Verificar todos los flujos:
  - [ ] Crear reserva (cliente)
  - [ ] Login admin
  - [ ] Login empleado
  - [ ] Confirmar reserva
  - [ ] Crear bloqueo
  - [ ] Generar reporte PDF
  - [ ] WhatsApp notifications

### Durante el Despliegue:
- [ ] Hacer backup de `.env` locales
- [ ] Subir código a GitHub (si no está)
- [ ] Desplegar backend primero
- [ ] Probar endpoints del backend
- [ ] Desplegar frontend
- [ ] Verificar conexión frontend-backend
- [ ] Crear usuario admin de producción
- [ ] Cargar datos de canchas y configuración

### Después del Despliegue:
- [ ] Probar flujo completo en producción
- [ ] Verificar notificaciones WhatsApp
- [ ] Probar desde diferentes dispositivos
- [ ] Verificar reportes PDF
- [ ] Crear 1-2 reservas de prueba
- [ ] Entrenar al personal del club

---

## 🎓 Capacitación para el Club

### Materiales a Entregar:

1. **Manual de Usuario (Admin):**
   - Cómo hacer login
   - Gestionar reservas
   - Confirmar/Cancelar reservas
   - Ver reportes
   - Crear bloqueos
   - Gestionar usuarios empleados

2. **Manual de Usuario (Empleado):**
   - Cómo hacer login
   - Ver reservas asignadas (Voley o Mini Golf)
   - Consultar información de clientes

3. **Credenciales:**
   ```
   URL Admin: https://tu-app.vercel.app/admin
   Usuario Admin: admin@southpark.com
   Contraseña: [ENTREGAR_SEGURA]
   
   URL Pública: https://tu-app.vercel.app
   ```

4. **Números de WhatsApp Configurados:**
   - Voley Playa: 573177751834
   - Mini Golf: 573147814609

---

## 🔧 Mantenimiento Post-Despliegue

### Backups:
- Neon hace backups automáticos
- Descargar backup manual mensualmente:
  ```bash
  pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
  ```

### Monitoreo:
- Railway/Render tienen logs integrados
- Revisar errores semanalmente
- Monitorear uso de base de datos

### Actualizaciones:
- Cambios pequeños: push a GitHub → auto-deploy
- Cambios de schema: 
  ```bash
  npx prisma migrate deploy
  ```

---

## 💰 Costos Estimados (Mensual)

| Servicio | Plan | Costo |
|----------|------|-------|
| **Neon** (PostgreSQL) | Free | $0 (hasta 0.5 GB) |
| **Railway** (Backend) | Free/Hobby | $0 - $5 |
| **Vercel** (Frontend) | Free | $0 |
| **Dominio** (Opcional) | - | ~$1/mes |
| **TOTAL** | | **$0 - $6/mes** |

Con el tráfico esperado del club, el plan gratuito debería ser suficiente.

---

## 🆘 Soporte Post-Entrega

### Problemas Comunes:

**1. "No puedo hacer login"**
- Verificar email y contraseña
- Check Caps Lock
- Resetear contraseña si necesario

**2. "No aparecen las reservas"**
- Verificar conexión a internet
- Recargar página (F5)
- Verificar que backend esté corriendo

**3. "WhatsApp no abre"**
- Verificar número de teléfono del cliente
- Verificar que tenga WhatsApp instalado

**4. "Error 500"**
- Revisar logs en Railway/Render
- Verificar conexión a base de datos
- Contactar soporte

---

## ✅ Checklist Final de Entrega

- [ ] Sistema desplegado y funcionando
- [ ] URLs documentadas
- [ ] Credenciales entregadas (de forma segura)
- [ ] Manual de usuario entregado
- [ ] Capacitación realizada
- [ ] Backup inicial creado
- [ ] Números de WhatsApp verificados
- [ ] Reserva de prueba creada y confirmada
- [ ] Plan de soporte definido

---

**¿Listo para el lanzamiento?** 🚀

Una vez completado este checklist, el sistema estará listo para que el club empiece a usarlo en producción.


# ⚡ Quick Start - South Park Reservas

## 🎯 Objetivo
Sistema completo de reservas para:
- **4 canchas de Voley Playa** (Lunes a Sábado, 4pm-12am)
- **2 circuitos de Mini Golf** (Jueves a Domingo, 4pm-10pm)

## ⚙️ Setup Rápido (5 minutos)

### 1️⃣ Base de Datos (Elige una opción)

**Opción A: Supabase (Más Fácil - Recomendado)** 🌟
```bash
1. Ir a: https://supabase.com
2. Crear cuenta gratis
3. Nuevo proyecto → Copiar "Connection String"
4. Crear archivo .env en la raíz:
   DATABASE_URL="tu-connection-string-aqui"
```

**Opción B: PostgreSQL Local**
```bash
1. Instalar PostgreSQL
2. Crear BD: CREATE DATABASE southpark_reservas;
3. Crear .env:
   DATABASE_URL="postgresql://postgres:password@localhost:5432/southpark_reservas"
```

### 2️⃣ Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate     # Nombre: "init"
npm run prisma:seed        # Crea datos de ejemplo
npm run dev               # Puerto 3000
```

### 3️⃣ Frontend
```bash
# En otra terminal, desde la raíz
npm install
npm run dev              # Puerto 5173
```

## 🧪 Probar el Sistema

1. **Backend API**: http://localhost:3000
2. **Ver canchas**: http://localhost:3000/api/canchas
3. **Frontend**: http://localhost:5173
4. **Base de datos visual**: `cd backend && npm run prisma:studio`

## 👤 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@southpark.com | admin123 |
| Cliente | cliente@ejemplo.com | cliente123 |

## 📊 Datos Creados Automáticamente

- ✅ 4 canchas de voley playa
- ✅ 2 circuitos de mini golf
- ✅ Precios configurados (con Happy Hour)
- ✅ 3 reservas de ejemplo
- ✅ 1 bloqueo de ejemplo

## 💰 Precios Configurados

### Voley Playa
- 1 hora: **$80.000**
- 2 horas (4-8pm): **$110.000** 🎉 Happy Hour
- 2 horas (8-12am): **$130.000**
- 3 horas: **$180.000**

### Mini Golf (por persona)
- 1 circuito: **$25.000**
- 2 circuitos: **$45.000**

## ✨ Funcionalidades Listas

✅ Crear reservas desde el frontend  
✅ Verificar disponibilidad en tiempo real  
✅ Cálculo automático de precios  
✅ Happy Hour (4-8pm = descuento)  
✅ Diferencia voley vs mini golf  
✅ Sistema de autenticación (backend)  
✅ API REST completa  

## 📝 Hacer una Reserva de Prueba

1. Ir a http://localhost:5173
2. Scroll hasta "Reservá tu Turno"
3. Seleccionar una cancha
4. Elegir fecha (hoy o después)
5. Seleccionar hora disponible
6. Completar datos
7. Click en "Crear Reserva"
8. ✅ Verás la confirmación con el precio y seña

## 🔍 Ver las Reservas en la Base de Datos

```bash
cd backend
npm run prisma:studio
```

Se abre en http://localhost:5555  
→ Click en "Reserva" para ver todas las reservas

## 🚨 Problemas Comunes

| Error | Solución |
|-------|----------|
| Can't reach database | Verifica DATABASE_URL en .env |
| Puerto 3000 ocupado | Cambia PORT=3001 en .env |
| Cannot find module | Ejecuta `npm install` |
| Las canchas no aparecen | Verifica que backend esté en puerto 3000 |

## 🎯 Próximos Pasos

Para la próxima sesión podemos crear:
1. **Panel de Admin** para gestionar reservas
2. **Login/Registro** en el frontend
3. **Área de usuario** (ver mis reservas)
4. **Sistema de pagos** (Wompi, PayU, MercadoPago)

## 📞 Comandos Útiles

```bash
# Ver base de datos visualmente
cd backend && npm run prisma:studio

# Reiniciar BD (CUIDADO: borra todo)
cd backend && npm run prisma:migrate -- --reset

# Ver logs backend
cd backend && npm run dev

# Ver logs frontend
npm run dev
```

## 🎉 ¡Listo!

El sistema ya funciona para recibir reservas.  
Solo falta el panel admin para gestionarlas.

**¿Dudas?** Lee `RESUMEN_Y_PASOS_FINALES.md` para más detalles.


# 🚀 Instrucciones de Configuración - South Park Reservas

## 📋 Prerequisitos

Asegúrate de tener instalado:
- **Node.js** (v20 o superior)
- **PostgreSQL** (v14 o superior)
- **npm** o **yarn**

## 🔧 Configuración Inicial

### 1. Configurar Base de Datos PostgreSQL

#### Opción A: Local (Recomendado para desarrollo)

```bash
# En PostgreSQL, crear la base de datos
CREATE DATABASE southpark_reservas;
```

#### Opción B: Usando Supabase (Gratis en la nube)

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta y un nuevo proyecto
3. Copia la cadena de conexión (Database URL)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar el ejemplo
cp .env.example .env
```

Edita `.env` y configura tu base de datos:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/southpark_reservas?schema=public"
JWT_SECRET="tu-secreto-super-seguro-cambialo"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

### 3. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 4. Ejecutar Migraciones de Prisma

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Crear las tablas en la base de datos
npm run prisma:migrate

# Si te pregunta por un nombre, puedes usar: "init"
```

### 5. Poblar Base de Datos con Datos Iniciales

```bash
npm run prisma:seed
```

Esto creará:
- ✅ Usuario admin (admin@southpark.com / admin123)
- ✅ Usuario cliente (cliente@ejemplo.com / cliente123)
- ✅ 4 canchas de voley playa con precios configurados
- ✅ 2 circuitos de mini golf con precios configurados
- ✅ Reservas de ejemplo
- ✅ Configuración general

### 6. Iniciar el Backend

```bash
# Modo desarrollo (con hot reload)
npm run dev

# El servidor estará en http://localhost:3000
```

### 7. Instalar Dependencias del Frontend

En otra terminal:

```bash
cd ..
npm install

# Instalar axios para llamadas al backend
npm install axios
```

### 8. Iniciar el Frontend

```bash
npm run dev

# La aplicación estará en http://localhost:5173
```

## 🧪 Verificar que Todo Funciona

1. **Backend**: Visita http://localhost:3000
   - Deberías ver un JSON con información de la API

2. **Base de Datos**: Visita http://localhost:3000/api/canchas
   - Deberías ver las 6 canchas creadas (4 voley + 2 mini golf)

3. **Prisma Studio** (Explorador de BD):
   ```bash
   cd backend
   npm run prisma:studio
   ```
   - Se abrirá en http://localhost:5555

## 🔑 Credenciales de Prueba

### Admin
- **Email**: admin@southpark.com
- **Password**: admin123
- **Acceso**: Panel de administración completo

### Cliente
- **Email**: cliente@ejemplo.com
- **Password**: cliente123
- **Acceso**: Área de usuario

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere token)

### Canchas
- `GET /api/canchas` - Listar todas las canchas
- `GET /api/canchas/:id` - Ver una cancha específica
- `POST /api/canchas` - Crear cancha (solo admin)
- `PUT /api/canchas/:id` - Actualizar cancha (solo admin)

### Disponibilidad
- `GET /api/disponibilidad/:canchaId/:fecha` - Ver horarios disponibles
- `GET /api/disponibilidad/verificar` - Verificar horario específico

### Reservas
- `POST /api/reservas` - Crear nueva reserva
- `GET /api/reservas` - Listar reservas (solo admin)
- `GET /api/reservas/:id` - Ver reserva específica
- `PATCH /api/reservas/:id/estado` - Actualizar estado (solo admin)
- `POST /api/reservas/:id/pago` - Marcar como pagado (solo admin)

## 🔍 Comandos Útiles

```bash
# Ver logs de la base de datos en tiempo real
cd backend
npm run prisma:studio

# Reiniciar base de datos (CUIDADO: borra todo)
npm run prisma:migrate -- --reset

# Compilar backend a producción
npm run build

# Ejecutar backend compilado
npm start
```

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica la cadena de conexión en `.env`

### Error: "Invalid `prisma.xxx()` invocation"
- Ejecuta `npm run prisma:generate` en el backend

### Puerto 3000 ya en uso
- Cambia el puerto en `.env`: `PORT=3001`
- O detén la aplicación que está usando el puerto

### No se ven las canchas en el frontend
- Verifica que el backend esté corriendo en http://localhost:3000
- Verifica la consola del navegador para errores CORS

## 🚀 Próximos Pasos

1. ✅ Backend funcionando con datos de prueba
2. ⏳ Conectar frontend con backend
3. ⏳ Implementar autenticación en frontend
4. ⏳ Crear panel de administración
5. ⏳ Implementar sistema de reservas completo
6. ⏳ (Opcional) Integrar pasarela de pagos

## 📞 Ayuda

Si tienes problemas con la configuración, verifica:
1. Que PostgreSQL esté corriendo
2. Que las variables de entorno estén bien configuradas
3. Que todas las dependencias estén instaladas
4. Que los puertos 3000 y 5173 estén libres


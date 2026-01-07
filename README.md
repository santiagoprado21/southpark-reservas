# 🏐 South Park Reservas

Sistema de gestión de reservas para club deportivo con Voley Playa y Mini Golf.

## 🚀 Características

### Para Clientes
- 🌐 Reserva online sin necesidad de registro
- 📅 Consulta de disponibilidad en tiempo real
- 📱 Consulta de reservas por email/teléfono
- 💬 Notificaciones automáticas por WhatsApp
- 💵 Pago directo en el complejo

### Para Administradores
- 📊 Dashboard con estadísticas en tiempo real
- 📋 Gestión completa de reservas
- 🚫 Sistema de bloqueos para mantenimiento
- 👥 Gestión de usuarios y permisos
- 📈 Reportes y estadísticas con exportación a PDF
- 📱 Interfaz totalmente responsive

### Para Empleados
- 👀 Visualización de reservas (solo lectura)
- 🎯 Filtrado automático por servicio asignado
- 📱 Panel optimizado para móvil

## 🛠️ Stack Tecnológico

### Frontend
- **React** con TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **React Router** - Navegación
- **React Query** - Estado del servidor
- **Axios** - Cliente HTTP
- **date-fns** - Manejo de fechas
- **jsPDF** - Generación de reportes PDF

### Backend
- **Node.js** con TypeScript
- **Express** - Framework web
- **Prisma ORM** - Base de datos
- **PostgreSQL** (Neon) - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hashing de contraseñas
- **Zod** - Validación de datos

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Cuenta en Neon (PostgreSQL)

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd SouthParkReservas
```

### 2. Instalar dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secret-key-seguro"
JWT_EXPIRES_IN="7d"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### 4. Configurar base de datos

```bash
cd backend

# Generar cliente de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Cargar datos iniciales
npx prisma db seed
```

### 5. Iniciar servidores

**Backend:**
```bash
cd backend
npm run dev
# Corre en http://localhost:3000
```

**Frontend:**
```bash
npm run dev
# Corre en http://localhost:5173
```

## 👤 Usuarios de Prueba

Después del seed, tendrás estos usuarios:

**Admin:**
- Email: `admin@southpark.com`
- Password: `admin123`
- Acceso completo al sistema

## 📁 Estructura del Proyecto

```
SouthParkReservas/
├── backend/                 # API Backend
│   ├── prisma/             # Schema y migraciones
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Auth, validación
│   │   └── utils/          # Utilidades
│   └── package.json
├── src/                     # Frontend React
│   ├── components/         # Componentes React
│   │   ├── admin/         # Panel de administración
│   │   └── ui/            # Componentes UI
│   ├── pages/             # Páginas principales
│   │   └── admin/         # Páginas del panel admin
│   ├── services/          # Servicios API
│   ├── utils/             # Utilidades
│   └── lib/               # Configuración
├── public/                 # Assets estáticos
└── README.md
```

## 🔐 Sistema de Permisos

Ver `PERMISOS.md` para documentación completa del sistema de roles y permisos.

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Acceso completo + gestión de usuarios |
| **EMPLEADO** | Solo lectura de reservas (filtrado por servicio) |
| **CLIENTE** | Crear reservas y consultar sus propias reservas |

## 📱 Funcionalidades Principales

### Reservas
- Creación de reservas para Voley Playa (por cancha) y Mini Golf (por persona)
- Sistema de precios diferenciados con Happy Hour
- Validación de disponibilidad en tiempo real
- Notificaciones automáticas por WhatsApp
- Pago directo en el complejo al llegar

### Panel de Administración
- **Dashboard**: Estadísticas y métricas clave
- **Reservas Hoy**: Vista rápida del día actual
- **Todas las Reservas**: Gestión completa con filtros
- **Bloqueos**: Gestión de mantenimientos y eventos
- **Reportes**: Exportación a PDF con filtros de fecha
- **Clientes**: Gestión de clientes
- **Usuarios**: Gestión de usuarios del sistema (solo ADMIN)

### Precios y Configuración

**Voley Playa:**
- 1 hora: $80,000
- 2 horas: $130,000 ($110,000 en Happy Hour 4-8pm)
- 3 horas: $180,000
- Horario: Lunes a Sábado, 4pm - 12am

**Mini Golf:**
- 1 circuito: $25,000 por persona
- 2 circuitos: $45,000 por persona
- Horario: Jueves a Domingo, 4pm - 10pm

## 🚀 Despliegue

### Frontend
Recomendado: **Vercel** o **Netlify**

```bash
npm run build
```

### Backend
Recomendado: **Railway** o **Render**

Variables de entorno necesarias:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

### Base de Datos
Usando **Neon** (PostgreSQL serverless)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a South Park Club.

## 👨‍💻 Desarrollo

Desarrollado para el club deportivo South Park.

---

**¿Necesitas ayuda?** Consulta la documentación adicional en `PERMISOS.md`.

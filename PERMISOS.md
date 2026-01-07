# 🔐 Sistema de Permisos - South Park Reservas

## Roles del Sistema

### 🔴 ADMIN (Administrador)
**Acceso Completo** - Sin restricciones

#### Panel de Administración
- ✅ Dashboard (ver estadísticas completas)
- ✅ Reservas Hoy (ver + confirmar + cancelar)
- ✅ Todas las Reservas (ver + crear + editar + confirmar + cancelar)
- ✅ Bloqueos (crear + editar + eliminar)
- ✅ Reportes y Estadísticas (generar PDFs)
- ✅ Gestión de Clientes (ver + editar)
- ✅ Usuarios del Sistema (crear + editar + desactivar)

#### API Backend
- ✅ `/api/reservas/*` - CRUD completo
- ✅ `/api/bloqueos/*` - CRUD completo
- ✅ `/api/usuarios/*` - CRUD completo
- ✅ `/api/canchas/*` - CRUD completo

---

### 🟡 EMPLEADO (Staff)
**Solo Lectura de Reservas** - Sin permisos de modificación

#### Panel de Administración
- ✅ Dashboard (solo ver estadísticas)
- ✅ Reservas Hoy (solo ver)
- ✅ Todas las Reservas (solo ver)
- ❌ Bloqueos (sin acceso)
- ❌ Reportes y Estadísticas (sin acceso)
- ❌ Gestión de Clientes (sin acceso)
- ❌ Usuarios del Sistema (sin acceso)

#### API Backend
- ✅ `GET /api/reservas` - Ver listado de reservas
- ✅ `GET /api/reservas/:id` - Ver detalle de una reserva
- ❌ `POST /api/reservas` - No puede crear reservas desde admin
- ❌ `PUT /api/reservas/:id` - No puede editar
- ❌ `PATCH /api/reservas/:id/estado` - No puede confirmar/cancelar
- ❌ `DELETE /api/reservas/:id` - No puede eliminar
- ❌ Todas las demás rutas protegidas

#### UI - Restricciones
- ❌ Sin botón "Nueva Reserva"
- ❌ Sin botones "Editar" en las reservas
- ❌ Sin botones "Confirmar" / "Cancelar"
- ✅ Solo puede consultar información

---

### 🟢 CLIENTE (Público)
**Sin acceso al panel** - Solo frontend público

#### Acceso Público
- ✅ Página principal (`/`)
- ✅ Crear reservas (sin login)
- ✅ Consultar "Mis Reservas" (`/mis-reservas`)

#### Restricciones
- ❌ Sin acceso al panel de administración (`/admin/*`)
- ❌ Sin acceso a API protegida

---

## 🔧 Implementación Técnica

### Backend

#### Middleware de Autenticación
```typescript
// authenticate: Verifica token JWT
// requireAdmin: Solo permite ADMIN
// requireStaff: Permite ADMIN + EMPLEADO
```

#### Protección de Rutas
```typescript
// SOLO ADMIN
- /api/usuarios/* (gestión de usuarios)
- /api/bloqueos/* (bloqueos de canchas)
- /api/canchas/* (configuración)
- /api/reportes/* (reportes)
- POST, PUT, PATCH, DELETE /api/reservas/*

// ADMIN + EMPLEADO
- GET /api/reservas (listar)
- GET /api/reservas/:id (ver detalle)

// PÚBLICO (sin auth)
- POST /api/reservas (crear desde web)
- GET /api/canchas (listar canchas)
- GET /api/disponibilidad (ver disponibilidad)
```

### Frontend

#### Verificación de Rol
```typescript
const user = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = user.role === "ADMIN";
```

#### Renderizado Condicional
- Menú lateral filtrado según rol
- Botones de acción ocultos para empleados
- Texto descriptivo adaptado ("Administra" vs "Consulta")

---

## 📝 Casos de Uso

### Escenario 1: Admin
1. Login como admin@southpark.com
2. Ve todas las opciones del menú
3. Puede crear/editar/eliminar todo
4. Gestiona usuarios y permisos

### Escenario 2: Empleado
1. Login como empleado@southpark.com
2. Ve solo Dashboard, Reservas Hoy, Todas las Reservas
3. Puede consultar información de reservas
4. No puede modificar nada
5. Útil para personal de recepción/atención

### Escenario 3: Cliente
1. Entra a la web sin login
2. Hace una reserva
3. Consulta sus reservas por email/teléfono
4. No accede al panel de administración

---

## 🚀 Futuras Mejoras

Consideraciones para expandir el sistema de permisos:

- **EMPLEADO Plus:** Permitir confirmar/cancelar reservas
- **SUPERVISOR:** Acceso a reportes sin gestión de usuarios
- **PERMISOS GRANULARES:** Por cancha/servicio específico
- **AUDIT LOG:** Registro de todas las acciones por usuario


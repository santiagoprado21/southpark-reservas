# South Park Reservas

Sistema de reservas para el complejo deportivo South Park - Voley Playa y Mini Golf.

## Descripción

Aplicación web para gestionar reservas de canchas de voley playa y mini golf en el complejo deportivo South Park. Incluye un frontend moderno construido con React y TypeScript, y un backend con Node.js.

## Tecnologías

### Frontend
- **Vite** - Build tool y servidor de desarrollo
- **React** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **shadcn-ui** - Componentes de UI
- **Tailwind CSS** - Framework de estilos
- **React Router** - Enrutamiento

### Backend
- **Node.js** - Runtime de JavaScript
- **Prisma** - ORM para base de datos
- **JWT** - Autenticación

## Instalación

### Requisitos previos
- Node.js (recomendado usar [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o bun

### Pasos

1. Clonar el repositorio:
```sh
git clone <YOUR_GIT_URL>
cd SouthParkReservas
```

2. Instalar dependencias del frontend:
```sh
npm install
```

3. Instalar dependencias del backend:
```sh
cd backend
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la carpeta `backend` con las variables necesarias

5. Iniciar el servidor de desarrollo:
```sh
# Desde la raíz del proyecto
npm run dev
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del proyecto

```
SouthParkReservas/
├── src/              # Código fuente del frontend
│   ├── components/   # Componentes React
│   ├── pages/        # Páginas de la aplicación
│   └── lib/          # Utilidades
├── backend/          # Código del backend
│   ├── controllers/  # Controladores
│   ├── routes/       # Rutas de la API
│   └── utils/        # Utilidades del backend
└── public/           # Archivos estáticos
```

## Desarrollo

Para trabajar en el proyecto:

1. Asegúrate de tener todas las dependencias instaladas
2. Inicia el servidor de desarrollo con `npm run dev`
3. El frontend estará disponible en `http://localhost:8080`
4. El backend debe estar configurado y corriendo en su puerto correspondiente

## Licencia

Este proyecto es privado.

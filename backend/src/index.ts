import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARES =====
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== RUTAS BÁSICAS =====
app.get('/', (req, res) => {
  res.json({
    message: '🏐 South Park Reservas API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      canchas: '/api/canchas',
      disponibilidad: '/api/disponibilidad',
      reservas: '/api/reservas',
      bloqueos: '/api/bloqueos',
      usuarios: '/api/usuarios',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== IMPORTAR RUTAS =====
import authRoutes from './routes/auth.routes';
import canchasRoutes from './routes/canchas.routes';
import disponibilidadRoutes from './routes/disponibilidad.routes';
import reservasRoutes from './routes/reservas.routes';
import bloqueosRoutes from './routes/bloqueos.routes';
import usuariosRoutes from './routes/usuarios.routes';

app.use('/api/auth', authRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/bloqueos', bloqueosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// ===== MANEJO DE ERRORES =====
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor',
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✅ API disponible en: http://localhost:${PORT}/`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});


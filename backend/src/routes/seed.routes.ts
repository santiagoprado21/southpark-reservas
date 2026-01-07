import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

/**
 * ENDPOINT TEMPORAL PARA SEED
 * Una vez ejecutado, eliminar este archivo y su importación
 * 
 * Llamar: GET /api/seed?secret=TU_SECRETO
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Protección básica
    const { secret } = req.query;
    const expectedSecret = process.env.SEED_SECRET || 'southpark2024';

    if (secret !== expectedSecret) {
      return res.status(403).json({ 
        error: true, 
        message: 'No autorizado. Proporciona el secret correcto.' 
      });
    }

    // Verificar si ya hay datos
    const existingCanchas = await prisma.cancha.count();
    if (existingCanchas > 0) {
      return res.status(400).json({
        error: true,
        message: 'La base de datos ya tiene datos. Seed ya fue ejecutado.',
        canchas: existingCanchas,
      });
    }

    console.log('🌱 Iniciando seed...');

    // 1. Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@southpark.com',
        password: hashedPassword,
        nombre: 'Administrador',
        role: 'ADMIN',
        servicioAsignado: 'TODOS',
        emailVerificado: true,
      },
    });

    console.log('✅ Usuario admin creado');

    // 2. Crear Canchas de Voley Playa
    const canchasVoley: any[] = [];
    for (let i = 1; i <= 4; i++) {
      const cancha = await prisma.cancha.create({
        data: {
          nombre: `Cancha de Voley ${i}`,
          tipo: 'VOLEY_PLAYA',
          descripcion: `Cancha de voley playa ${i}`,
          capacidadMaxima: 12,
          activa: true,
          orden: i,
          diasOperacion: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
          horaApertura: '16:00',
          horaCierre: '00:00',
        },
      });
      canchasVoley.push(cancha);
    }

    console.log('✅ Canchas de Voley creadas');

    // 3. Crear Canchas de Mini Golf
    const canchasMiniGolf: any[] = [];
    for (let i = 1; i <= 2; i++) {
      const cancha = await prisma.cancha.create({
        data: {
          nombre: `Mini Golf - Circuito ${i}`,
          tipo: 'MINI_GOLF',
          descripcion: `Circuito de 18 hoyos ${i}`,
          capacidadMaxima: null,
          activa: true,
          orden: i + 10,
          diasOperacion: ['JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
          horaApertura: '16:00',
          horaCierre: '22:00',
        },
      });
      canchasMiniGolf.push(cancha);
    }

    console.log('✅ Canchas de Mini Golf creadas');

    // 4. Configuración para Voley Playa
    for (const cancha of canchasVoley) {
      await prisma.configuracionCancha.create({
        data: {
          canchaId: cancha.id,
          precioHora1: 80000,
          precioHora2: 130000,
          precioHora3: 180000,
          tieneHappyHour: true,
          happyHourInicio: '16:00',
          happyHourFin: '20:00',
          precioHora2HappyHour: 110000,
          activa: true,
        },
      });
    }

    console.log('✅ Configuración de Voley creada');

    // 5. Configuración para Mini Golf
    for (const cancha of canchasMiniGolf) {
      await prisma.configuracionCancha.create({
        data: {
          canchaId: cancha.id,
          precioPersona1Circuito: 25000,
          precioPersona2Circuitos: 45000,
          activa: true,
        },
      });
    }

    console.log('✅ Configuración de Mini Golf creada');

    // 6. Configuración General (WhatsApp)
    await prisma.configuracionGeneral.createMany({
      data: [
        {
          clave: 'WHATSAPP_VOLEY',
          valor: '573177751834',
          descripcion: 'Número de WhatsApp para Voley Playa',
        },
        {
          clave: 'WHATSAPP_MINIGOLF',
          valor: '573147814609',
          descripcion: 'Número de WhatsApp para Mini Golf',
        },
      ],
    });

    console.log('✅ Configuración general creada');

    // Contar resultados
    const totalCanchas = await prisma.cancha.count();
    const totalConfig = await prisma.configuracionCancha.count();
    const totalUsers = await prisma.user.count();

    return res.json({
      success: true,
      message: '🌱 Seed ejecutado exitosamente',
      data: {
        admin: {
          email: 'admin@southpark.com',
          password: 'admin123',
        },
        canchas: totalCanchas,
        configuraciones: totalConfig,
        usuarios: totalUsers,
      },
    });

  } catch (error: any) {
    console.error('❌ Error en seed:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al ejecutar seed',
      details: error.message,
    });
  }
});

export default router;


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // Limpiar datos existentes (opcional)
  console.log('🧹 Limpiando datos existentes...');
  try {
    await prisma.pago.deleteMany();
    await prisma.bloqueo.deleteMany();
    await prisma.reserva.deleteMany();
    await prisma.configuracionCancha.deleteMany();
    await prisma.cancha.deleteMany();
    await prisma.user.deleteMany();
    await prisma.configuracionGeneral.deleteMany();
  } catch (error) {
    console.log('⚠️  Tablas no existen aún (primera vez), continuando...');
  }

  // ===== USUARIOS =====
  console.log('\n👤 Creando usuarios...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientePassword = await bcrypt.hash('cliente123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@southpark.com',
      password: adminPassword,
      nombre: 'Admin',
      apellido: 'South Park',
      telefono: '+57 300 123 4567',
      role: 'ADMIN',
      activo: true,
      emailVerificado: true,
    },
  });

  const cliente = await prisma.user.create({
    data: {
      email: 'cliente@ejemplo.com',
      password: clientePassword,
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '+57 300 987 6543',
      role: 'CLIENTE',
      activo: true,
      emailVerificado: true,
    },
  });

  console.log(`✅ Usuario Admin creado: ${admin.email} (password: admin123)`);
  console.log(`✅ Usuario Cliente creado: ${cliente.email} (password: cliente123)`);

  // ===== CANCHAS DE VOLEY PLAYA =====
  console.log('\n🏐 Creando canchas de Voley Playa...');
  
  const canchasVoley = [];
  for (let i = 1; i <= 4; i++) {
    const cancha = await prisma.cancha.create({
      data: {
        nombre: `Cancha de Voley ${i}`,
        tipo: 'VOLEY_PLAYA',
        capacidadMaxima: 12,
        activa: true,
        orden: i,
        diasOperacion: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
        horaApertura: '16:00',
        horaCierre: '00:00', // Medianoche
      },
    });

    // Configuración de precios para voley
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

    canchasVoley.push(cancha);
    console.log(`✅ ${cancha.nombre} creada con configuración de precios`);
  }

  // ===== CIRCUITOS DE MINI GOLF =====
  console.log('\n⛳ Creando circuitos de Mini Golf...');
  
  const canchasMiniGolf = [];
  for (let i = 1; i <= 2; i++) {
    const cancha = await prisma.cancha.create({
      data: {
        nombre: `Mini Golf - Circuito ${i}`,
        tipo: 'MINI_GOLF',
        activa: true,
        orden: 10 + i,
        diasOperacion: ['JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
        horaApertura: '16:00',
        horaCierre: '22:00',
      },
    });

    // Configuración de precios para mini golf
    await prisma.configuracionCancha.create({
      data: {
        canchaId: cancha.id,
        precioPersona1Circuito: 25000,
        precioPersona2Circuitos: 45000,
        activa: true,
      },
    });

    canchasMiniGolf.push(cancha);
    console.log(`✅ ${cancha.nombre} creado con configuración de precios`);
  }

  // ===== RESERVAS DE EJEMPLO =====
  console.log('\n📅 Creando reservas de ejemplo...');
  
  // Reserva de voley (happy hour)
  const reservaVoley1 = await prisma.reserva.create({
    data: {
      canchaId: canchasVoley[0].id,
      fecha: new Date('2026-01-10'),
      horaInicio: '18:00',
      horaFin: '20:00',
      duracionHoras: 2,
      nombreCliente: 'Carlos Rodríguez',
      emailCliente: 'carlos@ejemplo.com',
      telefonoCliente: '+57 300 111 2222',
      cantidadPersonas: 8,
      cantidadCircuitos: 1,
      precioTotal: 110000, // Happy hour
      montoSena: 33000,
      pagoCompletado: true,
      estado: 'CONFIRMADA',
    },
  });
  console.log(`✅ Reserva voley creada: ${reservaVoley1.nombreCliente}`);

  // Reserva de voley (horario nocturno)
  const reservaVoley2 = await prisma.reserva.create({
    data: {
      canchaId: canchasVoley[1].id,
      fecha: new Date('2026-01-10'),
      horaInicio: '20:00',
      horaFin: '22:00',
      duracionHoras: 2,
      nombreCliente: 'María González',
      emailCliente: 'maria@ejemplo.com',
      telefonoCliente: '+57 300 333 4444',
      cantidadPersonas: 10,
      cantidadCircuitos: 1,
      precioTotal: 130000, // Precio normal nocturno
      montoSena: 39000,
      pagoCompletado: false,
      estado: 'PENDIENTE',
    },
  });
  console.log(`✅ Reserva voley creada: ${reservaVoley2.nombreCliente}`);

  // Reserva de mini golf
  const reservaMiniGolf = await prisma.reserva.create({
    data: {
      canchaId: canchasMiniGolf[0].id,
      fecha: new Date('2026-01-12'),
      horaInicio: '17:00',
      horaFin: '19:00',
      duracionHoras: 2,
      nombreCliente: 'Ana y familia López',
      emailCliente: 'ana.lopez@ejemplo.com',
      telefonoCliente: '+57 300 555 6666',
      cantidadPersonas: 4,
      cantidadCircuitos: 2, // 2 circuitos
      precioTotal: 180000, // 4 personas x $45,000
      montoSena: 54000,
      pagoCompletado: true,
      estado: 'CONFIRMADA',
    },
  });
  console.log(`✅ Reserva mini golf creada: ${reservaMiniGolf.nombreCliente}`);

  // ===== BLOQUEOS DE EJEMPLO =====
  console.log('\n🔒 Creando bloqueos de ejemplo...');
  
  const bloqueo = await prisma.bloqueo.create({
    data: {
      canchaId: canchasVoley[0].id,
      fecha: new Date('2026-01-15'),
      horaInicio: '16:00',
      horaFin: '18:00',
      motivo: 'Mantenimiento programado',
    },
  });
  console.log(`✅ Bloqueo creado: ${bloqueo.motivo}`);

  // ===== CONFIGURACIÓN GENERAL =====
  console.log('\n⚙️ Creando configuración general...');
  
  await prisma.configuracionGeneral.createMany({
    data: [
      {
        clave: 'PORCENTAJE_SENA',
        valor: '30',
        descripcion: 'Porcentaje de seña requerido para reservas',
      },
      {
        clave: 'EMAIL_ADMIN',
        valor: 'admin@southpark.com',
        descripcion: 'Email del administrador para notificaciones',
      },
      {
        clave: 'WHATSAPP_NUMERO',
        valor: '+57 300 123 4567',
        descripcion: 'Número de WhatsApp para contacto',
      },
      {
        clave: 'NOMBRE_COMPLEJO',
        valor: 'South Park - Voley Playa & Mini Golf',
        descripcion: 'Nombre completo del complejo',
      },
    ],
  });
  console.log('✅ Configuración general creada');

  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('📝 Resumen:');
  console.log(`   - ${await prisma.user.count()} usuarios`);
  console.log(`   - ${await prisma.cancha.count()} canchas`);
  console.log(`   - ${await prisma.reserva.count()} reservas`);
  console.log(`   - ${await prisma.bloqueo.count()} bloqueos`);
  console.log(`   - ${await prisma.configuracionGeneral.count()} configuraciones\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


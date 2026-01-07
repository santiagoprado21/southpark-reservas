/**
 * Script para crear usuario administrador en producción
 * 
 * IMPORTANTE: Ejecutar solo UNA VEZ después del despliegue
 * 
 * Uso:
 *   node create-admin-prod.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔐 Crear Usuario Administrador para Producción\n');
  console.log('⚠️  IMPORTANTE: Usa un email y contraseña seguros\n');

  const nombre = await question('Nombre completo: ');
  const email = await question('Email: ');
  const password = await question('Contraseña (mínimo 8 caracteres): ');

  if (password.length < 8) {
    console.log('\n❌ La contraseña debe tener al menos 8 caracteres');
    process.exit(1);
  }

  // Verificar si ya existe un admin con ese email
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('\n❌ Ya existe un usuario con ese email');
    process.exit(1);
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      role: 'ADMIN',
      servicioAsignado: 'TODOS',
      activo: true,
      emailVerificado: true,
    },
    select: {
      id: true,
      email: true,
      nombre: true,
      role: true,
    },
  });

  console.log('\n✅ Usuario administrador creado exitosamente!\n');
  console.log('📋 Datos del admin:');
  console.log('   Email:', admin.email);
  console.log('   Nombre:', admin.nombre);
  console.log('   Rol:', admin.role);
  console.log('\n🔒 Guarda estas credenciales en un lugar seguro\n');
}

main()
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });


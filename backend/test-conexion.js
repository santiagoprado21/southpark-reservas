// Script simple para verificar la conexión a la base de datos
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('\n🔍 Verificando conexión a la base de datos...\n');
  
  try {
    // Intentar conectar
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos!\n');
    
    // Verificar si hay canchas
    const canchas = await prisma.cancha.findMany();
    console.log(`📊 Canchas en la BD: ${canchas.length}`);
    
    if (canchas.length === 0) {
      console.log('⚠️  No hay canchas. Necesitas ejecutar el seed:\n');
      console.log('   npm run prisma:seed\n');
    } else {
      console.log('✅ Canchas encontradas:');
      canchas.forEach(c => {
        console.log(`   - ${c.nombre} (${c.tipo})`);
      });
      console.log('\n✅ Todo listo para empezar!\n');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n📝 Posibles soluciones:');
    console.log('   1. Verifica que PostgreSQL esté corriendo');
    console.log('   2. Verifica el DATABASE_URL en el archivo .env');
    console.log('   3. Ejecuta las migraciones: npm run prisma:migrate\n');
    process.exit(1);
  }
}

testConnection();


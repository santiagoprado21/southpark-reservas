-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENTE');

-- CreateEnum
CREATE TYPE "TipoCancha" AS ENUM ('VOLEY_PLAYA', 'MINI_GOLF');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('SENA', 'COMPLETO', 'DIFERENCIA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'MERCADOPAGO', 'WOMPI', 'PAYU', 'TARJETA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canchas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCancha" NOT NULL,
    "descripcion" TEXT,
    "capacidadMaxima" INTEGER,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "diasOperacion" TEXT[],
    "horaApertura" TEXT NOT NULL,
    "horaCierre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canchas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuraciones_cancha" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "precioHora1" DOUBLE PRECISION,
    "precioHora2" DOUBLE PRECISION,
    "precioHora3" DOUBLE PRECISION,
    "tieneHappyHour" BOOLEAN NOT NULL DEFAULT false,
    "happyHourInicio" TEXT,
    "happyHourFin" TEXT,
    "precioHora2HappyHour" DOUBLE PRECISION,
    "precioPersona1Circuito" DOUBLE PRECISION,
    "precioPersona2Circuitos" DOUBLE PRECISION,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuraciones_cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "userId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "duracionHoras" INTEGER NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "emailCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT NOT NULL,
    "cantidadPersonas" INTEGER NOT NULL,
    "cantidadCircuitos" INTEGER,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "montoSena" DOUBLE PRECISION,
    "pagoCompletado" BOOLEAN NOT NULL DEFAULT false,
    "pagoId" TEXT,
    "metodoPago" TEXT,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "canceladaAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloqueos" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bloqueos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoPago" NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "pagoExternoId" TEXT,
    "datosPago" JSONB,
    "comprobanteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_general" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'STRING',
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_general_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "canchas_tipo_activa_idx" ON "canchas"("tipo", "activa");

-- CreateIndex
CREATE INDEX "configuraciones_cancha_canchaId_activa_idx" ON "configuraciones_cancha"("canchaId", "activa");

-- CreateIndex
CREATE INDEX "reservas_canchaId_fecha_estado_idx" ON "reservas"("canchaId", "fecha", "estado");

-- CreateIndex
CREATE INDEX "reservas_emailCliente_idx" ON "reservas"("emailCliente");

-- CreateIndex
CREATE INDEX "reservas_telefonoCliente_idx" ON "reservas"("telefonoCliente");

-- CreateIndex
CREATE INDEX "reservas_estado_idx" ON "reservas"("estado");

-- CreateIndex
CREATE INDEX "bloqueos_canchaId_fecha_activo_idx" ON "bloqueos"("canchaId", "fecha", "activo");

-- CreateIndex
CREATE INDEX "pagos_reservaId_idx" ON "pagos"("reservaId");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_general_clave_key" ON "configuracion_general"("clave");

-- AddForeignKey
ALTER TABLE "configuraciones_cancha" ADD CONSTRAINT "configuraciones_cancha_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "canchas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "canchas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueos" ADD CONSTRAINT "bloqueos_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "canchas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

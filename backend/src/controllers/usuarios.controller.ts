import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { successResponse, errorResponse } from '../utils/responses';

// Schemas de validación
const createUsuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.enum(['ADMIN', 'EMPLEADO']).default('EMPLEADO'),
  servicioAsignado: z.enum(['TODOS', 'VOLEY_PLAYA', 'MINI_GOLF']).optional(),
});

const updateUsuarioSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  nombre: z.string().min(2).optional(),
  role: z.enum(['ADMIN', 'EMPLEADO']).optional(),
  servicioAsignado: z.enum(['TODOS', 'VOLEY_PLAYA', 'MINI_GOLF']).optional(),
  activo: z.boolean().optional(),
});

/**
 * Crear un nuevo usuario
 * POST /api/usuarios
 */
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const data = createUsuarioSchema.parse(req.body);

    // Verificar que el email no esté registrado
    const usuarioExistente = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (usuarioExistente) {
      return errorResponse(res, 'El email ya está registrado', 400);
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario
    const usuario = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nombre: data.nombre,
        role: data.role as any,
        servicioAsignado: data.servicioAsignado,
      } as any,
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(res, { usuario }, 'Usuario creado exitosamente', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al crear usuario:', error);
    return errorResponse(res, 'Error al crear usuario', 500);
  }
};

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 */
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const { role, activo } = req.query;

    const where: any = {};

    if (role) where.role = role as string;
    if (activo !== undefined) where.activo = activo === 'true';

    const usuarios = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, { usuarios, total: usuarios.length });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return errorResponse(res, 'Error al obtener usuarios', 500);
  }
};

/**
 * Obtener un usuario por ID
 * GET /api/usuarios/:id
 */
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    return successResponse(res, { usuario });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return errorResponse(res, 'Error al obtener usuario', 500);
  }
};

/**
 * Actualizar un usuario
 * PUT /api/usuarios/:id
 */
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateUsuarioSchema.parse(req.body);

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Si se está actualizando el email, verificar que no esté en uso
    if (data.email && data.email !== usuarioExistente.email) {
      const emailEnUso = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailEnUso) {
        return errorResponse(res, 'El email ya está en uso', 400);
      }
    }

    // Preparar datos para actualizar
    const updateData: any = { ...data };

    // Si se está actualizando la contraseña, hashearla
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Actualizar usuario
    const usuario = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(res, { usuario }, 'Usuario actualizado exitosamente');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al actualizar usuario:', error);
    return errorResponse(res, 'Error al actualizar usuario', 500);
  }
};

/**
 * Eliminar (desactivar) un usuario
 * DELETE /api/usuarios/:id
 */
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // No permitir que un usuario se elimine a sí mismo
    if (req.user?.userId === id) {
      return errorResponse(res, 'No puedes eliminarte a ti mismo', 400);
    }

    const usuario = await prisma.user.update({
      where: { id },
      data: { activo: false },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(res, { usuario }, 'Usuario desactivado exitosamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return errorResponse(res, 'Error al eliminar usuario', 500);
  }
};


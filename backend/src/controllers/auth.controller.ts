import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/responses';

// Schemas de validación
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: z.string().min(8, 'Teléfono inválido'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Registrar un nuevo usuario
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return errorResponse(res, 'El email ya está registrado', 400);
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(data.password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        role: 'CLIENTE', // Por defecto es cliente
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        role: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      res,
      {
        user,
        token,
      },
      'Usuario registrado exitosamente',
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error en registro:', error);
    return errorResponse(res, 'Error al registrar usuario', 500);
  }
};

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return errorResponse(res, 'Usuario desactivado. Contacte al administrador', 403);
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        role: user.role,
      },
      token,
    }, 'Login exitoso');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error en login:', error);
    return errorResponse(res, 'Error al iniciar sesión', 500);
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/me
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'No autenticado', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        role: true,
        emailVerificado: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    return successResponse(res, { user }, 'Perfil obtenido exitosamente');
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return errorResponse(res, 'Error al obtener perfil', 500);
  }
};


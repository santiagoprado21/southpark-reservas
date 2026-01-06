import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: any = null,
  message: string = 'Operación exitosa',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string = 'Error en la operación',
  statusCode: number = 500,
  errors: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};


import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../../utils/response.js';
import { getUserIdFromToken } from '../../utils/auth.js';

const prisma = new PrismaClient();

type RequestBody = {
  title: string;
};

export const handler = async (event: { 
  headers: { Authorization?: string };
  body: string;
}) => {
  try {
    // Obtener y validar el token
    const authHeader = event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const userId = getUserIdFromToken(token);

    // Validar el body
    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    const { title } = JSON.parse(event.body) as RequestBody;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return errorResponse('Title is required', 400);
    }

    // Crear la lista
    const list = await prisma.list.create({
      data: {
        title: title.trim(),
        userId
      },
      include: {
        tasks: true
      }
    });

    return successResponse(list, 201);
  } catch (error) {
    console.error('Error creating list:', error);
    if (error instanceof Error && error.message === 'Invalid token') {
      return errorResponse('Unauthorized', 401);
    }
    return errorResponse('Internal server error', 500);
  }
}; 
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../../utils/response.js';
import { getUserIdFromToken } from '../../utils/auth.js';

const prisma = new PrismaClient();

export const handler = async (event: { headers: { Authorization?: string } }) => {
  try {
    // Obtener y validar el token
    const authHeader = event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const userId = getUserIdFromToken(token);

    // Obtener las listas del usuario
    const lists = await prisma.list.findMany({
      where: { userId },
      include: {
        tasks: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return successResponse(lists);
  } catch (error) {
    console.error('Error getting lists:', error);
    if (error instanceof Error && error.message === 'Invalid token') {
      return errorResponse('Unauthorized', 401);
    }
    return errorResponse('Internal server error', 500);
  }
}; 
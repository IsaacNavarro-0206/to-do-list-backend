import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../../utils/response.js';
import { getUserIdFromToken } from '../../utils/auth.js';

const prisma = new PrismaClient();

export const handler = async (event: { 
  headers: { Authorization?: string },
  pathParameters: { listId: string },
  body: string
}) => {
  try {
    // Obtener y validar el token
    const authHeader = event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const userId = getUserIdFromToken(token);

    // Validar el ID de la lista
    const listId = event.pathParameters.listId;
    if (!listId) {
      return errorResponse('List ID is required', 400);
    }

    // Parsear el body
    const body = JSON.parse(event.body);
    const { title } = body;

    if (!title) {
      return errorResponse('Title is required', 400);
    }

    // Verificar que la lista existe y pertenece al usuario
    const existingList = await prisma.list.findFirst({
      where: {
        id: listId,
        userId
      }
    });

    if (!existingList) {
      return errorResponse('List not found', 404);
    }

    // Actualizar la lista
    const updatedList = await prisma.list.update({
      where: {
        id: listId
      },
      data: {
        title
      },
      include: {
        tasks: true
      }
    });

    return successResponse(updatedList);
  } catch (error) {
    console.error('Error updating list:', error);
    if (error instanceof Error && error.message === 'Invalid token') {
      return errorResponse('Unauthorized', 401);
    }
    return errorResponse('Internal server error', 500);
  }
}; 
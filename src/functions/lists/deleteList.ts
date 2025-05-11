import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../../utils/response.js';
import { getUserIdFromToken } from '../../utils/auth.js';

const prisma = new PrismaClient();

export const handler = async (event: { 
  headers: { Authorization?: string },
  pathParameters: { listId: string }
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

    // Eliminar las tareas asociadas primero
    await prisma.task.deleteMany({
      where: {
        listId
      }
    });

    // Luego eliminar la lista
    await prisma.list.delete({
      where: {
        id: listId
      }
    });

    return successResponse({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    if (error instanceof Error && error.message === 'Invalid token') {
      return errorResponse('Unauthorized', 401);
    }
    return errorResponse('Internal server error', 500);
  }
}; 
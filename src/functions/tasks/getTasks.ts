import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../../utils/response.js";
import { getUserIdFromToken } from "../../utils/auth.js";

const prisma = new PrismaClient();

export const handler = async (event: {
  headers: { Authorization?: string };
  pathParameters: { listId: string } | null;
}) => {
  try {
    // Validar token
    const authHeader = event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    const userId = getUserIdFromToken(token);

    // Validar listId
    if (!event.pathParameters?.listId) {
      return errorResponse("List ID is required", 400);
    }

    const { listId } = event.pathParameters;

    // Verificar que la lista pertenece al usuario
    const list = await prisma.list.findFirst({
      where: { id: listId, userId },
    });

    if (!list) {
      return errorResponse("List not found", 404);
    }

    // Obtener las tareas
    const tasks = await prisma.task.findMany({
      where: { listId },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Internal server error", 500);
  }
};

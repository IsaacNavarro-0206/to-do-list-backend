import { PrismaClient } from "@prisma/client";
import { errorResponse } from "../../utils/response.js";
import { getUserIdFromToken } from "../../utils/auth.js";

const prisma = new PrismaClient();

export const handler = async (event: {
  headers: { Authorization?: string };
  pathParameters: { taskId: string } | null;
}) => {
  try {
    // Validar token
    const authHeader = event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    const userId = getUserIdFromToken(token);

    // Validar taskId
    if (!event.pathParameters?.taskId) {
      return errorResponse("Task ID is required", 400);
    }

    const { taskId } = event.pathParameters;

    // Verificar que la tarea existe y pertenece a una lista del usuario
    const task = await prisma.task.findFirst({
      where: { id: taskId },
      include: { list: true },
    });

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    if (task.list.userId !== userId) {
      return errorResponse("Unauthorized", 401);
    }

    // Eliminar la tarea
    await prisma.task.delete({
      where: { id: taskId },
    });

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Internal server error", 500);
  }
};

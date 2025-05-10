import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../../utils/response.js";
import { getUserIdFromToken } from "../../utils/auth.js";

const prisma = new PrismaClient();

type RequestBody = {
  title?: string;
  done?: boolean;
};

export const handler = async (event: {
  headers: { Authorization?: string };
  pathParameters: { taskId: string } | null;
  body: string;
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

    // Validar el body
    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const updates = JSON.parse(event.body) as RequestBody;

    // Validar campos
    if (
      updates.title !== undefined &&
      (typeof updates.title !== "string" || updates.title.trim().length === 0)
    ) {
      return errorResponse("Title must be a non-empty string", 400);
    }

    if (updates.done !== undefined && typeof updates.done !== "boolean") {
      return errorResponse("Done must be a boolean", 400);
    }

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

    // Actualizar la tarea
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(updates.title && { title: updates.title.trim() }),
        ...(updates.done !== undefined && { done: updates.done }),
      },
    });

    return successResponse(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Internal server error", 500);
  }
};

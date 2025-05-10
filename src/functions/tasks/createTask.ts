import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../../utils/response.js";
import { getUserIdFromToken } from "../../utils/auth.js";

const prisma = new PrismaClient();

type RequestBody = {
  title: string;
};

export const handler = async (event: {
  headers: { Authorization?: string };
  pathParameters: { listId: string } | null;
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

    // Validar el body
    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const { title } = JSON.parse(event.body) as RequestBody;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return errorResponse("Title is required", 400);
    }

    // Crear la tarea
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        listId,
      },
    });

    return successResponse(task, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Internal server error", 500);
  }
};

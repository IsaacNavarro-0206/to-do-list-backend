import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../../utils/response.js';

const prisma = new PrismaClient();

type RequestBody = {
  name: string;
  email: string;
  password: string;
};

export const handler = async (event: { body: string }) => {
  try {
    // Validar que el body existe
    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    // Parsear y validar el body
    const { name, email, password } = JSON.parse(event.body) as RequestBody;

    // Validar nombre
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return errorResponse('Name is required', 400);
    }

    // Validar email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return errorResponse('Valid email is required', 400);
    }

    // Validar password
    if (!password || typeof password !== 'string' || password.length < 6) {
      return errorResponse('Password must be at least 6 characters long', 400);
    }

    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse('Email already registered', 400);
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: hashedPassword,
      },
    });

    // Retornar el usuario sin la contraseña
    return successResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      201
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return errorResponse('Internal server error', 500);
  }
}; 
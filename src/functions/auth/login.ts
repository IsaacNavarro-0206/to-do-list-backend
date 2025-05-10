import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../../utils/response.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu-super-secreto-seguro-para-jwt';

type RequestBody = {
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
    const { email, password } = JSON.parse(event.body) as RequestBody;

    // Validar email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return errorResponse('Valid email is required', 400);
    }

    // Validar password
    if (!password || typeof password !== 'string') {
      return errorResponse('Password is required', 400);
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return errorResponse('Invalid credentials', 401);
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar el token
    return successResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return errorResponse('Internal server error', 500);
  }
}; 
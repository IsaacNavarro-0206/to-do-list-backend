import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-super-secreto-seguro-para-jwt';

export const getUserIdFromToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 
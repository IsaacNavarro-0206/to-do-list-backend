// Example of ES Module syntax
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
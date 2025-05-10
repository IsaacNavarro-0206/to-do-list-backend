import { getUserIdFromToken } from '../../utils/auth.js';

export const handler = async (event: { 
  headers: { Authorization?: string };
  methodArn: string;
}) => {
  try {
    const authHeader = event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const userId = getUserIdFromToken(token);

    return {
      principalId: userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      }
    };
  } catch (error) {
    throw new Error('Unauthorized');
  }
}; 
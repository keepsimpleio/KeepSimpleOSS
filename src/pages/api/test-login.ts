import { NextApiRequest, NextApiResponse } from 'next';
import { encode } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const mockUser = {
    username: 'Test User',
    email: 'test@example.com',
    sub: 'test-user-id',
  };

  const token = await encode({
    secret: process.env.NEXTAUTH_SECRET!,
    token: mockUser,
  });

  res.status(200).json({ token });
}

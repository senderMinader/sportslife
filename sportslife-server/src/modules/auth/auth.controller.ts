import { Request, Response } from 'express';

import { login } from './auth.service';
import { loginSchema } from './auth.validation';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const payload = loginSchema.parse(req.body);

  const result = await login(payload);

  res.status(200).json({
    data: result,
    message: 'Login successful',
  });
};

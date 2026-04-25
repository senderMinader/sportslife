import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import { UserModel } from '../users/user.model';
import { LoginInput } from './auth.validation';

export const login = async (payload: LoginInput) => {
  const user = await UserModel.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  );

  return {
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserRole } from '../common/enums/user-role.enum';
import { env } from '../config/env';

type JwtPayload = {
  sub: string;
  role: UserRole;
};

export const authMiddleware =
  (allowedRoles: UserRole[] = []) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      req.user = {
        userId: decoded.sub,
        role: decoded.role,
      };

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        res.status(403).json({
          message: 'Forbidden',
        });
        return;
      }

      next();
    } catch {
      res.status(401).json({
        message: 'Invalid or expired token',
      });
    }
  };

import { Router } from 'express';

import { UserRole } from '../../common/enums/user-role.enum';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  cancelMatchController,
  getMatchByIdController,
  getMatchesController,
  updateMatchResultController,
} from './match.controller';

export const matchRoutes = Router();

matchRoutes.get('/', getMatchesController);
matchRoutes.get('/:id', getMatchByIdController);

matchRoutes.put('/:id/result', authMiddleware([UserRole.ADMIN]), updateMatchResultController);

matchRoutes.put('/:id/cancel', authMiddleware([UserRole.ADMIN]), cancelMatchController);

import { Router } from 'express';

import { UserRole } from '../../common/enums/user-role.enum';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  createParticipantController,
  deleteParticipantController,
  getParticipantsController,
  updateParticipantController,
} from './participant.controller';

export const participantRoutes = Router();

participantRoutes.get('/', getParticipantsController);

participantRoutes.post('/', authMiddleware([UserRole.ADMIN]), createParticipantController);
participantRoutes.put('/:id', authMiddleware([UserRole.ADMIN]), updateParticipantController);
participantRoutes.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteParticipantController);

import { Router } from 'express';

import { UserRole } from '../../common/enums/user-role.enum';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  createTournamentController,
  deleteTournamentController,
  getTournamentByIdController,
  getTournamentsController,
  startTournamentController,
  updateTournamentController,
} from './tournament.controller';

export const tournamentRoutes = Router();

tournamentRoutes.get('/', getTournamentsController);
tournamentRoutes.get('/:id', getTournamentByIdController);

tournamentRoutes.post('/', authMiddleware([UserRole.ADMIN]), createTournamentController);
tournamentRoutes.put('/:id', authMiddleware([UserRole.ADMIN]), updateTournamentController);
tournamentRoutes.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteTournamentController);
tournamentRoutes.post('/:id/start', authMiddleware([UserRole.ADMIN]), startTournamentController);

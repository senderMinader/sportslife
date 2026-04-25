import { Router } from 'express';

import { authRoutes } from '../modules/auth/auth.routes';
import { matchRoutes } from '../modules/matches/match.routes';
import { participantRoutes } from '../modules/participants/participant.routes';
import { tournamentRoutes } from '../modules/tournaments/tournament.routes';

export const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'API is running',
  });
});

router.use('/auth', authRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/participants', participantRoutes);
router.use('/matches', matchRoutes);

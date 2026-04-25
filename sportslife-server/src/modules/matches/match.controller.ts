import { Request, Response } from 'express';

import {
  cancelMatch,
  getMatchById,
  getMatchesByTournament,
  updateMatchResult,
} from './match.service';
import {
  matchIdParamsSchema,
  matchListQuerySchema,
  updateMatchResultSchema,
} from './match.validation';

export const getMatchesController = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = matchListQuerySchema.parse(req.query);

  const matches = await getMatchesByTournament(tournamentId);

  res.status(200).json({
    data: matches,
    message: 'Matches fetched successfully',
  });
};

export const getMatchByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = matchIdParamsSchema.parse(req.params);

  const match = await getMatchById(id);

  res.status(200).json({
    data: match,
    message: 'Match fetched successfully',
  });
};

export const updateMatchResultController = async (req: Request, res: Response): Promise<void> => {
  const { id } = matchIdParamsSchema.parse(req.params);
  const payload = updateMatchResultSchema.parse(req.body);

  const match = await updateMatchResult(id, payload);

  res.status(200).json({
    data: match,
    message: 'Match result updated successfully',
  });
};

export const cancelMatchController = async (req: Request, res: Response): Promise<void> => {
  const { id } = matchIdParamsSchema.parse(req.params);

  const match = await cancelMatch(id);

  res.status(200).json({
    data: match,
    message: 'Match cancelled successfully',
  });
};

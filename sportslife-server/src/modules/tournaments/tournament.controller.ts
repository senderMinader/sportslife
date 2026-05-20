import { Request, Response } from 'express';

import {
  createTournament,
  deleteTournament,
  getTournamentById,
  getTournaments,
  startTournament,
  updateTournament,
} from './tournament.service';
import {
  createTournamentSchema,
  tournamentIdParamsSchema,
  tournamentListQuerySchema,
  updateTournamentSchema,
} from './tournament.validation';

export const createTournamentController = async (req: Request, res: Response): Promise<void> => {
  const payload = createTournamentSchema.parse(req.body);

  const tournament = await createTournament(payload, String(req.user?.userId));

  res.status(201).json({
    data: tournament,
    message: 'Tournament created successfully',
  });
};

export const getTournamentsController = async (req: Request, res: Response): Promise<void> => {
  const query = tournamentListQuerySchema.parse(req.query);

  const result = await getTournaments(query);

  res.status(200).json({
    data: result,
    message: 'Tournaments fetched successfully',
  });
};

export const getTournamentByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = tournamentIdParamsSchema.parse(req.params);

  const tournament = await getTournamentById(id);

  res.status(200).json({
    data: tournament,
    message: 'Tournament fetched successfully',
  });
};

export const updateTournamentController = async (req: Request, res: Response): Promise<void> => {
  const { id } = tournamentIdParamsSchema.parse(req.params);
  const payload = updateTournamentSchema.parse(req.body);

  const tournament = await updateTournament(id, payload);

  res.status(200).json({
    data: tournament,
    message: 'Tournament updated successfully',
  });
};

export const deleteTournamentController = async (req: Request, res: Response): Promise<void> => {
  const { id } = tournamentIdParamsSchema.parse(req.params);

  await deleteTournament(id);

  res.status(200).json({
    message: 'Tournament deleted successfully',
  });
};

export const startTournamentController = async (req: Request, res: Response): Promise<void> => {
  const { id } = tournamentIdParamsSchema.parse(req.params);

  const tournament = await startTournament(id);

  res.status(200).json({
    data: tournament,
    message: 'Tournament started successfully',
  });
};

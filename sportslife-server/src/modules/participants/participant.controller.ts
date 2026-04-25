import { Request, Response } from 'express';

import {
  createParticipant,
  deleteParticipant,
  getParticipantsByTournament,
  updateParticipant,
} from './participant.service';
import {
  createParticipantSchema,
  participantIdParamsSchema,
  participantListQuerySchema,
  updateParticipantSchema,
} from './participant.validation';

export const createParticipantController = async (req: Request, res: Response): Promise<void> => {
  const payload = createParticipantSchema.parse(req.body);

  const participant = await createParticipant(payload);

  res.status(201).json({
    data: participant,
    message: 'Participant created successfully',
  });
};

export const getParticipantsController = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = participantListQuerySchema.parse(req.query);

  const participants = await getParticipantsByTournament(tournamentId);

  res.status(200).json({
    data: participants,
    message: 'Participants fetched successfully',
  });
};

export const updateParticipantController = async (req: Request, res: Response): Promise<void> => {
  const { id } = participantIdParamsSchema.parse(req.params);
  const payload = updateParticipantSchema.parse(req.body);

  const participant = await updateParticipant(id, payload);

  res.status(200).json({
    data: participant,
    message: 'Participant updated successfully',
  });
};

export const deleteParticipantController = async (req: Request, res: Response): Promise<void> => {
  const { id } = participantIdParamsSchema.parse(req.params);

  await deleteParticipant(id);

  res.status(200).json({
    message: 'Participant deleted successfully',
  });
};

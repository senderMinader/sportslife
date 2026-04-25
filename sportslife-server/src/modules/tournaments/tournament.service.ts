import { Types } from 'mongoose';

import { TournamentStatus } from '../../common/enums/tournament-status.enum';
import { TournamentModel } from './tournament.model';
import {
  CreateTournamentInput,
  TournamentListQuery,
  UpdateTournamentInput,
} from './tournament.validation';

export const createTournament = async (payload: CreateTournamentInput, createdBy: string) => {
  return TournamentModel.create({
    ...payload,
    createdBy: new Types.ObjectId(createdBy),
  });
};

export const getTournaments = async ({ page, limit }: TournamentListQuery) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    TournamentModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    TournamentModel.countDocuments(),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTournamentById = async (id: string) => {
  const tournament = await TournamentModel.findById(id);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  return tournament;
};

export const updateTournament = async (id: string, payload: UpdateTournamentInput) => {
  const tournament = await TournamentModel.findById(id);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (tournament.status !== TournamentStatus.DRAFT) {
    throw new Error('Only draft tournaments can be updated');
  }

  Object.assign(tournament, payload);

  await tournament.save();

  return tournament;
};

export const deleteTournament = async (id: string) => {
  const tournament = await TournamentModel.findById(id);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (tournament.status !== TournamentStatus.DRAFT) {
    throw new Error('Only draft tournaments can be deleted');
  }

  await tournament.deleteOne();
};

export const startTournament = async (id: string) => {
  const tournament = await TournamentModel.findById(id);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (tournament.status !== TournamentStatus.DRAFT) {
    throw new Error('Tournament has already started or is not editable');
  }

  tournament.status = TournamentStatus.STARTED;
  tournament.startedAt = new Date();

  await tournament.save();

  return tournament;
};

import { TournamentStatus } from '../../common/enums/tournament-status.enum';
import { TournamentModel } from '../tournaments/tournament.model';
import { ParticipantModel } from './participant.model';
import { CreateParticipantInput, UpdateParticipantInput } from './participant.validation';

export const createParticipant = async (payload: CreateParticipantInput) => {
  const tournament = await TournamentModel.findById(payload.tournamentId);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (tournament.status !== TournamentStatus.DRAFT) {
    throw new Error('Participants can only be added before tournament start');
  }

  const participant = await ParticipantModel.create(payload);

  tournament.participantsCount += 1;
  await tournament.save();

  return participant;
};

export const getParticipantsByTournament = async (tournamentId: string) => {
  return ParticipantModel.find({ tournamentId }).sort({
    seed: 1,
    createdAt: 1,
  });
};

export const updateParticipant = async (id: string, payload: UpdateParticipantInput) => {
  const participant = await ParticipantModel.findById(id);

  if (!participant) {
    throw new Error('Participant not found');
  }

  const tournament = await TournamentModel.findById(participant.tournamentId);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (tournament.status !== TournamentStatus.DRAFT) {
    throw new Error('Participants can only be updated before tournament start');
  }

  Object.assign(participant, payload);
  await participant.save();

  return participant;
};

export const deleteParticipant = async (id: string) => {
  const participant = await ParticipantModel.findById(id);

  if (!participant) {
    throw new Error('Participant not found');
  }

  const tournament = await TournamentModel.findById(participant.tournamentId);

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (tournament.status !== TournamentStatus.DRAFT) {
    throw new Error('Participants can only be deleted before tournament start');
  }

  await participant.deleteOne();

  tournament.participantsCount = Math.max(0, tournament.participantsCount - 1);
  await tournament.save();
};

import { MatchStatus } from '../../common/enums/match-status.enum';
import { MatchModel } from './match.model';
import { UpdateMatchResultInput } from './match.validation';

export const getMatchesByTournament = async (tournamentId: string) => {
  return MatchModel.find({ tournamentId })
    .sort({ round: 1, matchNumber: 1 })
    .populate('participant1Id participant2Id winnerId');
};

export const getMatchById = async (id: string) => {
  const match = await MatchModel.findById(id).populate('participant1Id participant2Id winnerId');

  if (!match) {
    throw new Error('Match not found');
  }

  return match;
};

export const updateMatchResult = async (id: string, payload: UpdateMatchResultInput) => {
  const match = await MatchModel.findById(id);

  if (!match) {
    throw new Error('Match not found');
  }

  if (![MatchStatus.READY, MatchStatus.IN_PROGRESS].includes(match.status)) {
    throw new Error('Only ready or in progress matches can be updated');
  }

  if (!match.participant1Id || !match.participant2Id) {
    throw new Error('Match participants are incomplete');
  }

  if (payload.score1 === payload.score2) {
    throw new Error('A winner is required, draw is not allowed');
  }

  match.score1 = payload.score1;
  match.score2 = payload.score2;
  match.winnerId = payload.score1 > payload.score2 ? match.participant1Id : match.participant2Id;
  match.status = MatchStatus.COMPLETED;

  await match.save();

  return match;
};

export const cancelMatch = async (id: string) => {
  const match = await MatchModel.findById(id);

  if (!match) {
    throw new Error('Match not found');
  }

  if (![MatchStatus.PENDING, MatchStatus.READY].includes(match.status)) {
    throw new Error('Only pending or ready matches can be cancelled');
  }

  match.status = MatchStatus.CANCELLED;
  match.score1 = null;
  match.score2 = null;
  match.winnerId = null;

  await match.save();

  return match;
};

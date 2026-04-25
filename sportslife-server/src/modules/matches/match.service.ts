import { Types } from 'mongoose';
import { MatchStatus } from '../../common/enums/match-status.enum';
import { MatchModel } from './match.model';
import { UpdateMatchResultInput } from './match.validation';
import { BracketMatchInput } from '../../core/bracket/bracket.types';
import {
  buildWinnerPropagationPatch,
  resolveNextMatchStatus,
} from '../../core/bracket/bracket.service';

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

export const countMatchesByTournament = async (tournamentId: Types.ObjectId) => {
  return MatchModel.countDocuments({ tournamentId });
};

export const createBracketMatches = async (
  tournamentId: Types.ObjectId,
  generatedMatches: BracketMatchInput[],
) => {
  const tempKeyToIdMap = new Map<string, Types.ObjectId>();

  generatedMatches.forEach((match) => {
    tempKeyToIdMap.set(`${match.round}-${match.matchNumber}`, new Types.ObjectId());
  });

  const documents = generatedMatches.map((match) => ({
    _id: tempKeyToIdMap.get(`${match.round}-${match.matchNumber}`),
    tournamentId,
    round: match.round,
    matchNumber: match.matchNumber,
    participant1Id: match.participant1Id,
    participant2Id: match.participant2Id,
    nextMatchId: match.nextMatchTempKey
      ? (tempKeyToIdMap.get(match.nextMatchTempKey) ?? null)
      : null,
    nextMatchSlot: match.nextMatchSlot,
    status: match.status,
  }));

  return MatchModel.insertMany(documents);
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

  const patch = buildWinnerPropagationPatch({
    _id: match._id,
    round: match.round,
    matchNumber: match.matchNumber,
    participant1Id: match.participant1Id,
    participant2Id: match.participant2Id,
    winnerId: match.winnerId,
    nextMatchId: match.nextMatchId,
    nextMatchSlot: match.nextMatchSlot,
    status: match.status,
  });

  if (patch) {
    const nextMatch = await MatchModel.findById(patch.matchId);

    if (!nextMatch) {
      throw new Error('Next match not found');
    }

    if (patch.participant1Id !== undefined) {
      nextMatch.participant1Id = patch.participant1Id;
    }

    if (patch.participant2Id !== undefined) {
      nextMatch.participant2Id = patch.participant2Id;
    }

    nextMatch.status = resolveNextMatchStatus(nextMatch.participant1Id, nextMatch.participant2Id);

    await nextMatch.save();
  }

  return MatchModel.findById(match._id).populate(
    'participant1Id participant2Id winnerId nextMatchId',
  );
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

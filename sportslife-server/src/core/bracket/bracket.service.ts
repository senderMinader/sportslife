import { Types } from 'mongoose';

import { MatchStatus } from '../../common/enums/match-status.enum';
import {
  BracketMatch,
  BracketMatchInput,
  BracketParticipant,
  PropagationPatch,
} from './bracket.types';

const sortParticipantsForBracket = (participants: BracketParticipant[]): BracketParticipant[] => {
  return [...participants].sort((a, b) => {
    const seedA = a.seed ?? Number.MAX_SAFE_INTEGER;
    const seedB = b.seed ?? Number.MAX_SAFE_INTEGER;

    if (seedA !== seedB) {
      return seedA - seedB;
    }

    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return dateA - dateB;
  });
};

const buildSeedPositions = (bracketSize: number): number[] => {
  if (bracketSize === 1) {
    return [1];
  }

  const previous = buildSeedPositions(bracketSize / 2);

  return previous.flatMap((seed) => [seed, bracketSize + 1 - seed]);
};

const buildFirstRoundSlots = (participants: BracketParticipant[]): Array<Types.ObjectId | null> => {
  const sorted = sortParticipantsForBracket(participants);
  const seedPositions = buildSeedPositions(participants.length);

  return seedPositions.map((seedPosition) => sorted[seedPosition - 1]?._id ?? null);
};

export const generateSingleEliminationBracket = (
  participants: BracketParticipant[],
): BracketMatchInput[] => {
  if (participants.length < 4) {
    throw new Error('A tournament requires at least 4 participants to start');
  }

  const slots = buildFirstRoundSlots(participants);
  const totalRounds = Math.log2(slots.length);

  const rounds: BracketMatchInput[][] = [];

  for (let round = 1; round <= totalRounds; round += 1) {
    const matchesInRound = slots.length / 2 ** round;
    const currentRound: BracketMatchInput[] = [];

    for (let matchIndex = 0; matchIndex < matchesInRound; matchIndex += 1) {
      currentRound.push({
        round,
        matchNumber: matchIndex + 1,
        participant1Id: null,
        participant2Id: null,
        nextMatchTempKey: null,
        nextMatchSlot: null,
        status: MatchStatus.PENDING,
      });
    }

    rounds.push(currentRound);
  }

  for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex += 1) {
    const currentRound = rounds[roundIndex];
    const nextRound = rounds[roundIndex + 1];

    currentRound.forEach((match, index) => {
      const targetMatch = nextRound[Math.floor(index / 2)];

      match.nextMatchTempKey = `${targetMatch.round}-${targetMatch.matchNumber}`;
      match.nextMatchSlot = index % 2 === 0 ? 1 : 2;
    });
  }

  const firstRound = rounds[0];

  firstRound.forEach((match, index) => {
    match.participant1Id = slots[index * 2] ?? null;
    match.participant2Id = slots[index * 2 + 1] ?? null;

    if (match.participant1Id && match.participant2Id) {
      match.status = MatchStatus.READY;
    }
  });

  return rounds.flat();
};

export const buildWinnerPropagationPatch = (match: BracketMatch): PropagationPatch | null => {
  if (!match.winnerId || !match.nextMatchId || !match.nextMatchSlot) {
    return null;
  }

  const patch: PropagationPatch = {
    matchId: match.nextMatchId,
  };

  if (match.nextMatchSlot === 1) {
    patch.participant1Id = match.winnerId;
  } else {
    patch.participant2Id = match.winnerId;
  }

  return patch;
};

export const resolveNextMatchStatus = (
  participant1Id: Types.ObjectId | string | null,
  participant2Id: Types.ObjectId | string | null,
): MatchStatus => {
  if (participant1Id && participant2Id) {
    return MatchStatus.READY;
  }

  return MatchStatus.PENDING;
};

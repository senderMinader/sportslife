import { Types } from 'mongoose';

import { MatchStatus } from '../../common/enums/match-status.enum';

export interface BracketParticipant {
  _id: Types.ObjectId;
  seed?: number | null;
  createdAt?: Date;
}

export interface BracketMatchInput {
  round: number;
  matchNumber: number;
  participant1Id: Types.ObjectId | null;
  participant2Id: Types.ObjectId | null;
  nextMatchTempKey: string | null;
  nextMatchSlot: 1 | 2 | null;
  status: MatchStatus;
}

export interface BracketMatch {
  _id: Types.ObjectId | string;
  round: number;
  matchNumber: number;
  participant1Id: Types.ObjectId | null;
  participant2Id: Types.ObjectId | null;
  winnerId?: Types.ObjectId | null;
  nextMatchId: Types.ObjectId | string | null;
  nextMatchSlot: 1 | 2 | null;
  status: MatchStatus;
}

export interface PropagationPatch {
  matchId: Types.ObjectId | string;
  participant1Id?: Types.ObjectId | null;
  participant2Id?: Types.ObjectId | null;
  status?: MatchStatus;
}

import { HydratedDocument, Types } from 'mongoose';

import { MatchStatus } from '../../common/enums/match-status.enum';

export interface Match {
  _id: Types.ObjectId;
  tournamentId: Types.ObjectId;
  round: number;
  matchNumber: number;
  participant1Id: Types.ObjectId | null;
  participant2Id: Types.ObjectId | null;
  score1: number | null;
  score2: number | null;
  winnerId: Types.ObjectId | null;
  status: MatchStatus;
  nextMatchId: Types.ObjectId | null;
  nextMatchSlot: 1 | 2 | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MatchDocument = HydratedDocument<Match>;

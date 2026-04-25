import { Schema, model } from 'mongoose';

import { MatchStatus } from '../../common/enums/match-status.enum';
import { Match } from './match.types';

const matchSchema = new Schema<Match>(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
      index: true,
    },
    round: {
      type: Number,
      required: true,
      min: 1,
    },
    matchNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    participant1Id: {
      type: Schema.Types.ObjectId,
      ref: 'Participant',
      default: null,
    },
    participant2Id: {
      type: Schema.Types.ObjectId,
      ref: 'Participant',
      default: null,
    },
    score1: {
      type: Number,
      default: null,
      min: 0,
    },
    score2: {
      type: Number,
      default: null,
      min: 0,
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Participant',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      required: true,
      default: MatchStatus.PENDING,
    },
    nextMatchId: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
      default: null,
    },
    nextMatchSlot: {
      type: Number,
      enum: [1, 2],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

matchSchema.index({ tournamentId: 1, round: 1, matchNumber: 1 }, { unique: true });

export const MatchModel = model<Match>('Match', matchSchema);

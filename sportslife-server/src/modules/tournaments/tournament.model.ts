import { Schema, model } from 'mongoose';

import { TournamentStatus } from '../../common/enums/tournament-status.enum';
import { TournamentType } from '../../common/enums/tournament-type.enum';
import { Tournament } from './tournament.types';

const tournamentSchema = new Schema<Tournament>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: Object.values(TournamentType),
      required: true,
      default: TournamentType.SINGLE_ELIMINATION,
    },
    status: {
      type: String,
      enum: Object.values(TournamentStatus),
      required: true,
      default: TournamentStatus.DRAFT,
    },
    participantsCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TournamentModel = model<Tournament>('Tournament', tournamentSchema);

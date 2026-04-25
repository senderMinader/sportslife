import { Schema, model } from 'mongoose';

import { Participant } from './participant.types';

const participantSchema = new Schema<Participant>(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    seed: {
      type: Number,
      default: null,
      min: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

participantSchema.index({ tournamentId: 1, name: 1 }, { unique: true });

export const ParticipantModel = model<Participant>('Participant', participantSchema);

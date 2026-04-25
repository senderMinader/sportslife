import { HydratedDocument, Types } from 'mongoose';

export interface Participant {
  _id: Types.ObjectId;
  tournamentId: Types.ObjectId;
  name: string;
  /** Classement tête de série du joueur */
  seed: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ParticipantDocument = HydratedDocument<Participant>;

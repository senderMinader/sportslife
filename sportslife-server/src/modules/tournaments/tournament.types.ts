import { HydratedDocument, Types } from 'mongoose';

import { TournamentStatus } from '../../common/enums/tournament-status.enum';
import { TournamentType } from '../../common/enums/tournament-type.enum';

export interface Tournament {
  _id: Types.ObjectId;
  name: string;
  description?: string | null;
  type: TournamentType;
  status: TournamentStatus;
  participantsCount: number;
  createdBy: Types.ObjectId;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TournamentDocument = HydratedDocument<Tournament>;

import { HydratedDocument, Types } from 'mongoose';

import { UserRole } from '../../common/enums/user-role.enum';

export interface User {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

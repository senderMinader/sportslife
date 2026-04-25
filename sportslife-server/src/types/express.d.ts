import { Types } from 'mongoose';

import { UserRole } from '../common/enums/user-role.enum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: Types.ObjectId | string;
        role: UserRole;
      };
    }
  }
}

export {};

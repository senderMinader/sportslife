import bcrypt from 'bcryptjs';

import { UserRole } from '../common/enums/user-role.enum';
import { UserModel } from '../modules/users/user.model';

export const seedAdmin = async () => {
  const adminEmail = 'admin@sportslife.com';
  const adminPassword = 'Admin12345!';
  const username = 'Admin Tia Sport';

  const existingAdmin = await UserModel.findOne({ email: adminEmail });

  if (existingAdmin) {
    return existingAdmin;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await UserModel.create({
    email: adminEmail,
    passwordHash,
    role: UserRole.ADMIN,
    username,
  });

  return admin;
};

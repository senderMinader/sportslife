import mongoose from 'mongoose';

import { connectToDatabase } from '../config/db';
import { seedAdmin } from '../seeds/admin.seed';
import { seedTournaments } from '../seeds/tournament.seed';

const runSeed = async (): Promise<void> => {
  try {
    await connectToDatabase();

    const admin = await seedAdmin();

    /** VIGILENCE - THIS DELETE ALL EXISTING TOURNAMENTS AND ITS RELATED PARTICIPANTS, MATCHES */
    const data = await seedTournaments({
      adminId: admin._id.toString(),
    });

    console.log('Seed completed successfully');
    console.log({
      admin: {
        email: admin.email,
        password: 'Admin12345!',
      },
      tournaments: [
        {
          id: data.draftTournament._id.toString(),
          name: data.draftTournament.name,
          status: data.draftTournament.status,
        },
        {
          id: data.startedTournament._id.toString(),
          name: data.startedTournament.name,
          status: data.startedTournament.status,
        },
      ],
    });
  } catch (error) {
    console.error('Seed failed', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

void runSeed();

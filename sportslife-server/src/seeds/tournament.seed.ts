import { MatchStatus } from '../common/enums/match-status.enum';
import { TournamentStatus } from '../common/enums/tournament-status.enum';
import { TournamentType } from '../common/enums/tournament-type.enum';
import { MatchModel } from '../modules/matches/match.model';
import { ParticipantModel } from '../modules/participants/participant.model';
import { TournamentModel } from '../modules/tournaments/tournament.model';

type SeedTournamentParams = {
  adminId: string;
};

export const seedTournaments = async ({ adminId }: SeedTournamentParams) => {
  await MatchModel.deleteMany({});
  await ParticipantModel.deleteMany({});
  await TournamentModel.deleteMany({});

  const draftTournament = await TournamentModel.create({
    name: 'Tournoi FIFA 26 - Draft',
    description: 'Tournoi de demonstration en attente de lancement',
    type: TournamentType.SINGLE_ELIMINATION,
    status: TournamentStatus.DRAFT,
    participantsCount: 4,
    createdBy: adminId,
  });

  const draftParticipants = await ParticipantModel.insertMany([
    { tournamentId: draftTournament._id, name: 'Alice', seed: 1 },
    { tournamentId: draftTournament._id, name: 'Bob', seed: 2 },
    { tournamentId: draftTournament._id, name: 'Charlie', seed: 3 },
    { tournamentId: draftTournament._id, name: 'Diana', seed: 4 },
  ]);

  const startedTournament = await TournamentModel.create({
    name: 'Tournoi Echecs - Started',
    description: 'Tournoi de demonstration deja demarre',
    type: TournamentType.SINGLE_ELIMINATION,
    status: TournamentStatus.STARTED,
    participantsCount: 4,
    createdBy: adminId,
    startedAt: new Date(),
  });

  const startedParticipants = await ParticipantModel.insertMany([
    { tournamentId: startedTournament._id, name: 'Mora', seed: 1 },
    { tournamentId: startedTournament._id, name: 'Bema', seed: 2 },
    { tournamentId: startedTournament._id, name: 'Noro', seed: 3 },
    { tournamentId: startedTournament._id, name: 'Bina', seed: 4 },
  ]);

  const semifinal1 = await MatchModel.create({
    tournamentId: startedTournament._id,
    round: 1,
    matchNumber: 1,
    participant1Id: startedParticipants[0]._id,
    participant2Id: startedParticipants[3]._id,
    score1: 1,
    score2: 0,
    winnerId: startedParticipants[0]._id,
    status: MatchStatus.COMPLETED,
    nextMatchSlot: 1,
  });

  const semifinal2 = await MatchModel.create({
    tournamentId: startedTournament._id,
    round: 1,
    matchNumber: 2,
    participant1Id: startedParticipants[1]._id,
    participant2Id: startedParticipants[2]._id,
    status: MatchStatus.READY,
    nextMatchSlot: 2,
  });

  const finalMatch = await MatchModel.create({
    tournamentId: startedTournament._id,
    round: 2,
    matchNumber: 1,
    participant1Id: startedParticipants[0]._id,
    participant2Id: null,
    status: MatchStatus.PENDING,
  });

  semifinal1.nextMatchId = finalMatch._id;
  semifinal2.nextMatchId = finalMatch._id;

  await semifinal1.save();
  await semifinal2.save();

  return {
    draftTournament,
    draftParticipants,
    startedTournament,
    startedParticipants,
    matches: {
      semifinal1,
      semifinal2,
      finalMatch,
    },
  };
};

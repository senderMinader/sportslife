export interface Participant {
  _id: string;
  tournamentId: string;
  name: string;
  seed?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MatchParticipantRef {
  _id: string;
  name: string;
}

export interface Match {
  _id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  participant1Id: MatchParticipantRef | null;
  participant2Id: MatchParticipantRef | null;
  winnerId: MatchParticipantRef | null;
  score1: number | null;
  score2: number | null;
  status: string;
  nextMatchId?: string | null;
  nextMatchSlot?: 1 | 2 | null;
  createdAt: string;
  updatedAt: string;
}

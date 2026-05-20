export interface Participant {
  _id: string;
  tournamentId: string;
  name: string;
  seed?: number | null;
  createdAt: string;
  updatedAt: string;
}

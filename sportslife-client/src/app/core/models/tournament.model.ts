export interface Tournament {
  _id: string;
  name: string;
  description?: string | null;
  type: string;
  status: string;
  participantsCount: number;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentListResponse {
  items: Tournament[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

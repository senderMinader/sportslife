import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Tournament, TournamentListResponse } from '../models/tournament.model';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  constructor(private readonly http: HttpClient) {}

  getTournaments(page = 1, limit = 10) {
    return this.http.get<ApiResponse<TournamentListResponse>>(
      `${environment.apiUrl}/tournaments?page=${page}&limit=${limit}`,
    );
  }

  getTournamentById(id: string) {
    return this.http.get<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${id}`);
  }

  createTournament(payload: { name: string; description?: string | null; type: string }) {
    return this.http.post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments`, payload);
  }

  startTournament(id: string) {
    return this.http.post<ApiResponse<Tournament>>(
      `${environment.apiUrl}/tournaments/${id}/start`,
      {},
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private readonly http: HttpClient) {}

  getMatches(tournamentId: string) {
    return this.http.get<ApiResponse<Match[]>>(
      `${environment.apiUrl}/matches?tournamentId=${tournamentId}`,
    );
  }

  updateResult(id: string, payload: { score1: number; score2: number }) {
    return this.http.put<ApiResponse<Match>>(`${environment.apiUrl}/matches/${id}/result`, payload);
  }

  cancelMatch(id: string) {
    return this.http.put<ApiResponse<Match>>(`${environment.apiUrl}/matches/${id}/cancel`, {});
  }
}

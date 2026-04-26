import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Participant } from '../models/participant.model';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(private readonly http: HttpClient) {}

  getParticipants(tournamentId: string) {
    return this.http.get<ApiResponse<Participant[]>>(
      `${environment.apiUrl}/participants?tournamentId=${tournamentId}`,
    );
  }

  createParticipant(payload: { tournamentId: string; name: string; seed?: number | null }) {
    return this.http.post<ApiResponse<Participant>>(`${environment.apiUrl}/participants`, payload);
  }
}

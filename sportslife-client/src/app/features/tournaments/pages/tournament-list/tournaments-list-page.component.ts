import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Tournament } from '../../../../core/models/tournament.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TournamentService } from '../../../../core/services/tournament.service';

@Component({
  selector: 'app-tournaments-list-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './tournaments-list-page.component.html',
  styleUrl: './tournaments-list-page.component.scss',
})
export class TournamentsListPageComponent implements OnInit {
  readonly tournaments = signal<Tournament[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly tournamentService: TournamentService,
    public readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchTournaments();
  }

  fetchTournaments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.tournamentService.getTournaments().subscribe({
      next: (response) => {
        this.tournaments.set(response.data.items);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Erreur de chargement');
        this.loading.set(false);
      },
    });
  }

  goToCreate(): void {
    void this.router.navigate(['/tournaments/create']);
  }
}

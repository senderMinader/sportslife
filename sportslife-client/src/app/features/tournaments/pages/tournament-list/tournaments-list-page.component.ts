import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Tournament } from '../../../../core/models/tournament.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TournamentService } from '../../../../core/services/tournament.service';
import { PageEvent } from '@angular/material/paginator';
import { TournamentTableComponent } from '../../components/tournament-table/tournament-table.component';

@Component({
  selector: 'app-tournaments-list-page',
  standalone: true,
  imports: [RouterLink, TournamentTableComponent],
  templateUrl: './tournaments-list-page.component.html',
  styleUrl: './tournaments-list-page.component.scss',
})
export class TournamentsListPageComponent implements OnInit {
  readonly tournaments = signal<Tournament[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);

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

    const page = this.pageIndex() + 1;
    const limit = this.pageSize();

    this.tournamentService.getTournaments(page, limit).subscribe({
      next: (response) => {
        this.tournaments.set(response.data.items);
        this.totalItems.set(response.data?.meta?.total);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message ?? 'Erreur de chargement');
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetchTournaments();
  }

  goToCreate(): void {
    void this.router.navigate(['/tournaments/create']);
  }
}

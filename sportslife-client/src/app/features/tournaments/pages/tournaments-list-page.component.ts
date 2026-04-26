import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Tournament } from '../../../core/models/tournament.model';
import { AuthService } from '../../../core/services/auth.service';
import { TournamentService } from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournaments-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Tournois</h1>
          <p>Liste des tournois disponibles</p>
        </div>

        <div class="actions">
          <button type="button" (click)="goToCreate()">Nouveau tournoi</button>
          <button type="button" (click)="logout()">Déconnexion</button>
        </div>
      </header>

      <p *ngIf="loading()">Chargement...</p>
      <p class="error" *ngIf="error()">{{ error() }}</p>

      <div class="list" *ngIf="!loading()">
        <article class="card" *ngFor="let tournament of tournaments()">
          <h2>{{ tournament.name }}</h2>
          <p>{{ tournament.description || 'Aucune description' }}</p>
          <p>Statut: {{ tournament.status }}</p>
          <p>Participants: {{ tournament.participantsCount }}</p>
          <a [routerLink]="['/tournaments', tournament._id]">Voir le détail</a>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }

      .actions {
        display: flex;
        gap: 12px;
      }

      .list {
        display: grid;
        gap: 16px;
      }

      .card {
        padding: 16px;
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        background: white;
      }

      .error {
        color: #b42318;
      }
    `,
  ],
})
export class TournamentsListPageComponent implements OnInit {
  readonly tournaments = signal<Tournament[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly authService: AuthService,
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

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Tournament } from '../../../core/models/tournament.model';
import { AuthService } from '../../../core/services/auth.service';
import { TournamentService } from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournaments-list-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="landing-page">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-tag">Tournament management, visual brackets, live progression</span>
          <h1>
            Des tournois lisibles,
            <span>modernes et pilotables</span>
          </h1>
          <p>
            Consultez les tournois publics, explorez les brackets et suivez les matchs. Les actions
            d’administration sont réservées aux utilisateurs connectés.
          </p>

          <div class="hero-actions">
            <a routerLink="/tournaments" class="btn-primary">Explorer les tournois</a>
            @if (!authService.isAuthenticated()) {
              <a routerLink="/login" class="btn-secondary">Accès admin</a>
            } @else {
              <a routerLink="/tournaments/create" class="btn-secondary">Nouveau tournoi</a>
            }
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-card hero-card--primary">
            <span>Public</span>
            <strong>Liste et détail accessibles</strong>
          </div>
          <div class="hero-card">
            <span>Admin</span>
            <strong>Création, score, lancement, annulation</strong>
          </div>
        </div>
      </section>

      <section class="section-head">
        <div>
          <h2>Tournois</h2>
          <p>Liste paginée visible sans authentification.</p>
        </div>
      </section>

      @if (loading()) {
        <p>Chargement...</p>
      }

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      @if (!loading()) {
        <div class="tournaments-grid">
          @for (tournament of tournaments(); track tournament._id) {
            <article class="tournament-card">
              <div class="card-top">
                <span class="status-chip" [attr.data-status]="tournament.status">
                  {{ tournament.status }}
                </span>
                <span class="muted">{{ tournament.type }}</span>
              </div>

              <h3>{{ tournament.name }}</h3>
              <p>{{ tournament.description || 'Aucune description disponible.' }}</p>

              <div class="card-meta">
                <span>{{ tournament.participantsCount }} participants</span>
                <span>
                  {{
                    tournament.startedAt
                      ? 'Démarré' + ' · ' + (tournament.startedAt | date: 'dd/MM/yyyy')
                      : 'En attente'
                  }}
                </span>
              </div>

              <a [routerLink]="['/tournaments', tournament._id]" class="btn-secondary inline-link">
                Voir le tournoi
              </a>
            </article>
          } @empty {
            <p>Aucun tournoi trouvé.</p>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .landing-page {
        padding: 28px;
        display: grid;
        gap: 28px;
      }

      .hero {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 24px;
        padding: 30px;
        border-radius: 28px;
        background:
          radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0.74));
        border: 1px solid var(--border);
      }

      .hero-copy h1 {
        margin: 0;
        font-size: clamp(2.2rem, 4vw, 4.4rem);
        line-height: 0.98;
        letter-spacing: -0.04em;
      }

      .hero-copy h1 span {
        display: block;
        font-style: italic;
        font-weight: 400;
      }

      .hero-copy p {
        max-width: 700px;
        color: var(--text-muted);
        font-size: 1.04rem;
        line-height: 1.7;
      }

      .hero-tag {
        display: inline-block;
        margin-bottom: 18px;
        padding: 0.5rem 0.8rem;
        border-radius: 999px;
        background: var(--primary-soft);
        color: var(--accent-black);
        font-weight: 700;
        font-size: 0.85rem;
      }

      .hero-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 22px;
      }

      .hero-panel {
        display: grid;
        gap: 16px;
        align-content: center;
      }

      .hero-card {
        padding: 20px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
        display: grid;
        gap: 8px;
      }

      .hero-card span {
        color: var(--text-soft);
        font-size: 0.88rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .hero-card strong {
        font-size: 1.1rem;
      }

      .hero-card--primary {
        background: var(--gradient-violet);
        color: white;
      }

      .hero-card--primary span {
        color: rgba(255, 255, 255, 0.76);
      }

      .section-head h2 {
        margin: 0 0 6px;
        font-size: 1.8rem;
      }

      .section-head p,
      .muted,
      .card-meta {
        color: var(--text-muted);
      }

      .tournaments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 18px;
      }

      .tournament-card {
        padding: 20px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
        display: grid;
        gap: 14px;
      }

      .card-top,
      .card-meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .tournament-card h3 {
        margin: 0;
        font-size: 1.2rem;
      }

      .tournament-card p {
        margin: 0;
        line-height: 1.6;
      }

      .inline-link {
        width: fit-content;
      }

      .error {
        color: var(--danger);
      }

      @media (max-width: 960px) {
        .hero {
          grid-template-columns: 1fr;
        }
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

import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Match } from '../../../core/models/match.model';
import { Participant } from '../../../core/models/participant.model';
import { Tournament } from '../../../core/models/tournament.model';
import { MatchService } from '../../../core/services/match.service';
import { ParticipantService } from '../../../core/services/participant.service';
import { TournamentService } from '../../../core/services/tournament.service';
import { AuthService } from '../../../core/services/auth.service';

type MatchResultForm = FormGroup<{
  score1: FormControl<number>;
  score2: FormControl<number>;
}>;

@Component({
  selector: 'app-tournament-detail-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    @if (tournament(); as tournament) {
      <section class="page">
        <header class="page-header">
          <div>
            <h1>{{ tournament.name }}</h1>
            <p>{{ tournament.description || 'Aucune description' }}</p>
            <p>Statut: {{ tournament.status }}</p>
            <p>Participants: {{ tournament.participantsCount }}</p>
          </div>

          <div class="actions">
            <a routerLink="/tournaments">Retour</a>

            @if (tournament.status === 'draft' && canManageTournament()) {
              <div class="start-block">
                <button
                  type="button"
                  (click)="startTournament()"
                  [disabled]="!canStartTournament()"
                >
                  {{ startLoading() ? 'Lancement...' : 'Lancer le tournoi' }}
                </button>

                @if (startValidationMessage()) {
                  <p class="hint">{{ startValidationMessage() }}</p>
                }
              </div>
            }
          </div>
        </header>

        @if (pageError()) {
          <p class="error">{{ pageError() }}</p>
        }

        <div class="grid">
          <section class="card">
            <h2>Participants</h2>

            @if (tournament.status === 'draft' && canManageTournament()) {
              <form [formGroup]="participantForm" (ngSubmit)="addParticipant()" class="inline-form">
                <input type="text" formControlName="name" placeholder="Nom du participant" />
                <input type="number" formControlName="seed" placeholder="Seed" />
                <button type="submit" [disabled]="participantLoading() || participantForm.invalid">
                  Ajouter
                </button>
              </form>
            }

            @if (participantError()) {
              <p class="error">{{ participantError() }}</p>
            }

            <div class="list">
              @for (participant of participants(); track participant._id) {
                <article class="row">
                  <span>{{ participant.name }}</span>
                  <span>Seed: {{ participant.seed ?? '-' }}</span>
                </article>
              } @empty {
                <p>Aucun participant.</p>
              }
            </div>
          </section>

          <section class="card">
            <h2>Matchs</h2>

            @if (matches().length === 0) {
              <p>Aucun match généré pour le moment.</p>
            }

            @if (matchesByRound().length > 0) {
              <div class="rounds">
                @for (round of matchesByRound(); track round.round) {
                  <section class="round">
                    <h3>Round {{ round.round }}</h3>

                    @for (match of round.matches; track match._id) {
                      <article class="match-card" [attr.data-status]="match.status">
                        <div class="match-header">
                          <strong>Match {{ match.matchNumber }}</strong>
                          <span>{{ match.status }}</span>
                        </div>

                        <div class="players">
                          <div>{{ match.participant1Id?.name || 'TBD' }}</div>
                          <div>{{ match.participant2Id?.name || 'TBD' }}</div>
                        </div>

                        <div class="scores">
                          <span>Score: {{ match.score1 ?? '-' }} - {{ match.score2 ?? '-' }}</span>

                          @if (match.winnerId) {
                            <span>Gagnant: {{ match.winnerId.name }}</span>
                          }
                        </div>

                        @if (canManageTournament() && canEditMatch(match)) {
                          <form
                            class="inline-form"
                            [formGroup]="getMatchForm(match._id)"
                            (ngSubmit)="updateMatchResult(match._id)"
                          >
                            <input type="number" formControlName="score1" placeholder="Score 1" />
                            <input type="number" formControlName="score2" placeholder="Score 2" />
                            <button type="submit">Enregistrer</button>
                          </form>
                        }

                        @if (canManageTournament() && canCancelMatch(match)) {
                          <button type="button" (click)="cancelMatch(match._id)">
                            Annuler le match
                          </button>
                        }
                      </article>
                    }
                  </section>
                }
              </div>
            }
          </section>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .page {
        padding: 24px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
      }

      .actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 24px;
      }

      .card {
        padding: 20px;
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        background: white;
      }

      .list {
        display: grid;
        gap: 10px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #eaecf0;
      }

      .rounds {
        display: grid;
        gap: 20px;
      }

      .round {
        display: grid;
        gap: 12px;
      }

      .match-card {
        border: 1px solid #eaecf0;
        border-radius: 10px;
        padding: 14px;
        display: grid;
        gap: 12px;
      }

      .match-header,
      .players,
      .scores,
      .inline-form {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      input,
      button {
        padding: 8px 10px;
      }

      .error {
        color: #b42318;
        margin: 12px 0;
      }

      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TournamentDetailPageComponent implements OnInit {
  readonly tournament = signal<Tournament | null>(null);
  readonly participants = signal<Participant[]>([]);
  readonly matches = signal<Match[]>([]);

  readonly pageError = signal<string | null>(null);
  readonly participantError = signal<string | null>(null);
  readonly participantLoading = signal(false);
  readonly startLoading = signal(false);

  private readonly matchForms = new Map<string, MatchResultForm>();
  private tournamentId = '';

  readonly participantForm: FormGroup;

  readonly matchesByRound = computed(() => {
    const grouped = new Map<number, Match[]>();

    for (const match of this.matches()) {
      const existing = grouped.get(match.round) ?? [];
      existing.push(match);
      grouped.set(match.round, existing);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([round, matches]) => ({
        round,
        matches: matches.sort((a, b) => a.matchNumber - b.matchNumber),
      }));
  });

  readonly startValidationMessage = computed(() => {
    const tournament = this.tournament();
    const participants = this.participants();

    if (!tournament || tournament.status !== 'draft') {
      return null;
    }

    if (participants.length < 4) {
      return 'Minimum 4 participants requis pour lancer le tournoi.';
    }

    return null;
  });

  readonly canStartTournament = computed(() => {
    const tournament = this.tournament();

    return Boolean(
      tournament &&
      tournament.status === 'draft' &&
      !this.startValidationMessage() &&
      !this.startLoading(),
    );
  });

  readonly canManageTournament = computed(() => this.authService.isAuthenticated());

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly tournamentService: TournamentService,
    private readonly participantService: ParticipantService,
    private readonly matchService: MatchService,
    public readonly authService: AuthService,
  ) {
    this.participantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      seed: [null as number | null],
    });
  }

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.tournamentId) {
      this.pageError.set('Identifiant de tournoi invalide');
      return;
    }

    this.loadPage();
  }

  loadPage(): void {
    this.loadTournament();
    this.loadParticipants();
    this.loadMatches();
  }

  loadTournament(): void {
    this.tournamentService.getTournamentById(this.tournamentId).subscribe({
      next: (response) => {
        this.tournament.set(response.data);
      },
      error: (error) => {
        this.pageError.set(error?.error?.message ?? 'Erreur de chargement du tournoi');
      },
    });
  }

  loadParticipants(): void {
    this.participantService.getParticipants(this.tournamentId).subscribe({
      next: (response) => {
        this.participants.set(response.data);
      },
      error: (error) => {
        this.pageError.set(error?.error?.message ?? 'Erreur de chargement des participants');
      },
    });
  }

  loadMatches(): void {
    this.matchService.getMatches(this.tournamentId).subscribe({
      next: (response) => {
        this.matches.set(response.data);
      },
      error: (error) => {
        this.pageError.set(error?.error?.message ?? 'Erreur de chargement des matchs');
      },
    });
  }

  addParticipant(): void {
    if (this.participantForm.invalid || !this.tournament()) {
      return;
    }

    this.participantLoading.set(true);
    this.participantError.set(null);

    const rawValue = this.participantForm.getRawValue();

    this.participantService
      .createParticipant({
        tournamentId: this.tournamentId,
        name: rawValue.name ?? '',
        seed: rawValue.seed ?? null,
      })
      .subscribe({
        next: () => {
          this.participantLoading.set(false);
          this.participantForm.reset({ name: '', seed: null });
          this.loadTournament();
          this.loadParticipants();
        },
        error: (error) => {
          this.participantLoading.set(false);
          this.participantError.set(error?.error?.message ?? 'Impossible d’ajouter le participant');
        },
      });
  }

  startTournament(): void {
    this.startLoading.set(true);
    this.pageError.set(null);

    this.tournamentService.startTournament(this.tournamentId).subscribe({
      next: () => {
        this.startLoading.set(false);
        this.loadTournament();
        this.loadMatches();
      },
      error: (error) => {
        this.startLoading.set(false);
        this.pageError.set(error?.error?.message ?? 'Impossible de lancer le tournoi');
      },
    });
  }

  getMatchForm(matchId: string): MatchResultForm {
    const existing = this.matchForms.get(matchId);

    if (existing) {
      return existing;
    }

    const form: MatchResultForm = this.fb.nonNullable.group({
      score1: [0, [Validators.required, Validators.min(0)]],
      score2: [0, [Validators.required, Validators.min(0)]],
    });

    this.matchForms.set(matchId, form);

    return form;
  }

  updateMatchResult(matchId: string): void {
    const form = this.getMatchForm(matchId);

    if (form.invalid) {
      return;
    }

    this.matchService.updateResult(matchId, form.getRawValue()).subscribe({
      next: () => {
        this.loadMatches();
      },
      error: (error) => {
        this.pageError.set(error?.error?.message ?? 'Impossible de mettre à jour le score');
      },
    });
  }

  cancelMatch(matchId: string): void {
    this.matchService.cancelMatch(matchId).subscribe({
      next: () => {
        this.loadMatches();
      },
      error: (error) => {
        this.pageError.set(error?.error?.message ?? 'Impossible d’annuler le match');
      },
    });
  }

  canEditMatch(match: Match): boolean {
    return match.status === 'ready' || match.status === 'in_progress';
  }

  canCancelMatch(match: Match): boolean {
    return match.status === 'pending' || match.status === 'ready';
  }
}

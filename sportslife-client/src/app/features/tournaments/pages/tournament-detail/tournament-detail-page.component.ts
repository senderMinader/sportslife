import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Match } from '../../../../core/models/match.model';
import { Participant } from '../../../../core/models/participant.model';
import { Tournament } from '../../../../core/models/tournament.model';
import { MatchService } from '../../../../core/services/match.service';
import { ParticipantService } from '../../../../core/services/participant.service';
import { TournamentService } from '../../../../core/services/tournament.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  BracketBoardComponent,
  BracketRoundLabel,
  BracketRoundView,
} from '../../components/bracket-board/bracket-board.component';

type MatchResultForm = FormGroup<{
  score1: FormControl<number>;
  score2: FormControl<number>;
}>;

@Component({
  selector: 'app-tournament-detail-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, BracketBoardComponent],
  templateUrl: './tournament-detail.component.html',
  styleUrl: './tournament-detail.component.scss',
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

  readonly matchesByRound = computed<BracketRoundView[]>(() => {
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

  readonly roundLabels = computed<BracketRoundLabel[]>(() => {
    const rounds = this.matchesByRound();
    const totalRounds = rounds.length;

    return rounds.map((round) => {
      let label = `Round ${round.round}`;

      if (totalRounds === 2) {
        label = round.round === 1 ? 'Demi-finales' : 'Finale';
      }

      if (totalRounds === 3) {
        if (round.round === 1) {
          label = 'Quart de finale';
        } else if (round.round === 2) {
          label = 'Demi-finales';
        } else {
          label = 'Finale';
        }
      }

      if (totalRounds >= 4) {
        if (round.round === totalRounds) {
          label = 'Finale';
        } else if (round.round === totalRounds - 1) {
          label = 'Demi-finales';
        } else if (round.round === totalRounds - 2) {
          label = 'Quart de finale';
        }
      }

      return {
        round: round.round,
        label,
        matchesCount: round.matches.length,
      };
    });
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

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ready':
        return 'Prêt';
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      case 'in_progress':
        return 'En cours';
      default:
        return status;
    }
  }
}

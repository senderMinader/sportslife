import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TournamentService } from '../../../../core/services/tournament.service';

@Component({
  selector: 'app-tournament-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tournament-create-page.component.html',
  styleUrl: './tournament-create-page.component.scss',
})
export class TournamentCreatePageComponent {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tournamentService: TournamentService,
    private readonly router: Router,
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['single_elimination', [Validators.required]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const rawValue = this.form.getRawValue();

    this.tournamentService
      .createTournament({
        name: rawValue.name,
        description: rawValue.description || null,
        type: rawValue.type,
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          void this.router.navigate(['/tournaments', response.data._id]);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error?.error?.message ?? 'Impossible de créer le tournoi');
        },
      });
  }
}

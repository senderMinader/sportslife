import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TournamentService } from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournament-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Nouveau tournoi</h1>
          <p>Créer un tournoi en brouillon</p>
        </div>

        <a routerLink="/tournaments">Retour à la liste</a>
      </header>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>
            Nom
            <input type="text" formControlName="name" />
          </label>

          <label>
            Description
            <textarea rows="4" formControlName="description"></textarea>
          </label>

          <label>
            Type
            <select formControlName="type">
              <option value="single_elimination">Single elimination</option>
            </select>
          </label>

          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Création...' : 'Créer le tournoi' }}
          </button>
        </form>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
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

      .card {
        max-width: 640px;
        padding: 20px;
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        background: white;
      }

      form {
        display: grid;
        gap: 16px;
      }

      label {
        display: grid;
        gap: 8px;
      }

      input,
      textarea,
      select,
      button {
        padding: 10px 12px;
      }

      .error {
        color: #b42318;
        margin-top: 16px;
      }
    `,
  ],
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

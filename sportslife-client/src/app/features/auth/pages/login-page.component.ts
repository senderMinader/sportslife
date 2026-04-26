import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="login-page">
      <div class="login-card">
        <h1>Connexion admin</h1>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>
            Email
            <input type="email" formControlName="email" />
          </label>

          <label>
            Mot de passe
            <input type="password" formControlName="password" />
          </label>

          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <p class="error" *ngIf="error()">{{ error() }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #f5f7fb;
      }

      .login-card {
        width: 100%;
        max-width: 420px;
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
      }

      form {
        display: grid;
        gap: 16px;
      }

      label {
        display: grid;
        gap: 8px;
      }

      input {
        padding: 10px 12px;
      }

      button {
        padding: 12px;
        cursor: pointer;
      }

      .error {
        color: #b42318;
        margin-top: 16px;
      }
    `,
  ],
})
export class LoginPageComponent {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/tournaments']);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error?.error?.message ?? 'Connexion impossible');
      },
    });
  }
}

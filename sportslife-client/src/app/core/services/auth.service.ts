import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginPayload, LoginResponse, AuthUser } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'sportslife_access_token';
const AUTH_USER_KEY = 'sportslife_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));

  private readonly userSignal = signal<AuthUser | null>(this.getStoredUser());

  readonly token = computed(() => this.tokenSignal());
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          const { accessToken, user } = response.data;

          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

          this.tokenSignal.set(accessToken);
          this.userSignal.set(user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}

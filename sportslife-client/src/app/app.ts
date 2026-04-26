import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('sportslife-client');
  constructor(public readonly authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

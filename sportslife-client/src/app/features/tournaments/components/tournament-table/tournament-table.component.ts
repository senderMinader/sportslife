import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import type { Tournament } from '../../../../core/models/tournament.model';

@Component({
  selector: 'app-tournament-table',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './tournament-table.component.html',
  styleUrl: './tournament-table.component.scss',
})
export class TournamentTableComponent {
  tournaments = input.required<Tournament[]>();
  loading = input<boolean>(false);
  totalItems = input<number>(0);
  pageSize = input<number>(10);
  pageIndex = input<number>(0);

  pageChange = output<PageEvent>();

  displayedColumns: string[] = ['name', 'type', 'status', 'participantsCount', 'startedAt'];

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onRowClick(id: string): void {
    // géré via routerLink sur la row, cette méthode peut servir pour analytics etc.
  }
}

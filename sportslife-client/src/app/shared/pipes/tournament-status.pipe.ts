import { Pipe, PipeTransform } from '@angular/core';
import { TournamentStatus } from '../../core/models/tournament.model';

const STATUS_LABELS: Record<TournamentStatus, string> = {
  [TournamentStatus.DRAFT]: 'Brouillon',
  [TournamentStatus.STARTED]: 'En cours',
  [TournamentStatus.COMPLETED]: 'Terminé',
  [TournamentStatus.CANCELLED]: 'Annulé',
};

@Pipe({
  name: 'tournamentStatus',
  standalone: true,
  pure: true,
})
export class TournamentStatusPipe implements PipeTransform {
  transform(value: string): string {
    return STATUS_LABELS[value as TournamentStatus] ?? value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { TournamentType } from '../../core/models/tournament.model';

const TYPE_LABELS: Record<TournamentType, string> = {
  [TournamentType.SINGLE_ELIMINATION]: 'Élimination directe',
};

@Pipe({
  name: 'tournamentType',
  standalone: true,
  pure: true,
})
export class TournamentTypePipe implements PipeTransform {
  transform(value: string): string {
    return TYPE_LABELS[value as TournamentType] ?? value;
  }
}

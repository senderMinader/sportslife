import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Match } from '../../../../core/models/match.model';

export interface BracketRoundView {
  round: number;
  matches: Match[];
}

export interface BracketRoundLabel {
  round: number;
  label: string;
  matchesCount: number;
}

@Component({
  selector: 'app-bracket-board',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bracket-board.component.html',
  styleUrl: './bracket-board.component.scss',
})
export class BracketBoardComponent {
  @Input({ required: true }) matches: Match[] = [];
  @Input({ required: true }) matchesByRound: BracketRoundView[] = [];
  @Input({ required: true }) roundLabels: BracketRoundLabel[] = [];
  @Input({ required: true }) canManageTournament = false;
  @Input({ required: true }) getStatusLabel!: (status: string) => string;
  @Input({ required: true }) canEditMatch!: (match: Match) => boolean;
  @Input({ required: true }) canCancelMatch!: (match: Match) => boolean;
  @Input({ required: true }) getMatchForm!: (matchId: string) => FormGroup;

  @Output() updateResult = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();

  onUpdateResult(matchId: string): void {
    this.updateResult.emit(matchId);
  }

  onCancel(matchId: string): void {
    this.cancel.emit(matchId);
  }
}

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-error-card',
  imports: [Card, Button],
  templateUrl: './error-card.component.html'
})
export class ErrorCardComponent {
  @Input({ required: true }) error = signal<string | null>(null);
  @Output() retry = new EventEmitter<void>();
}

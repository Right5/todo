import { Component, Input, signal } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-error-card',
  imports: [Card],
  templateUrl: './error-card.component.html',
  styleUrl: './error-card.component.css'
})
export class ErrorCardComponent {
  @Input({ required: true }) error = signal<string | null>(null);
}

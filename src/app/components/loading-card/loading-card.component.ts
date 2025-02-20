import { Component, Input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-card',
  imports: [ProgressSpinner],
  templateUrl: './loading-card.component.html',
  styleUrl: './loading-card.component.css'
})
export class LoadingCardComponent {
  @Input() text = 'Loading...';
}

import { Component, Input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-card',
  imports: [ProgressSpinner],
  templateUrl: './loading-card.component.html'
})
export class LoadingCardComponent {
  @Input() text = 'Loading...';
}

import { Component, effect, inject, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { WeatherResponse } from '../../models/weather-response.model';
import { catchError, delay, of } from 'rxjs';
import { ErrorCardComponent } from '../../components/error-card/error-card.component';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, Card, ErrorCardComponent, ProgressSpinner],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);

  country = signal<string>('');
  weather = signal<WeatherResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    this.route.params.pipe(delay(5000)).subscribe((params) => {
      this.country.set(params['country']);
    });

    effect(() => {
      console.log('effect!');
      if (this.country()) {
        this.loadWeather();
      }
    });
  }

  protected loadWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.country()}&APPID=794ee95e63c5a32aaf88cd813fa2e425`;

    this.loading.set(true);

    this.http
      .get<any>(url)
      .pipe(
        catchError((error) => {
          this.error.set(error.message);
          return of([]);
        })
      )
      .subscribe((response) => {
        this.weather.set(response);
        this.loading.set(false);
      });
  }
}

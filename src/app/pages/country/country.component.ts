import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../../models/weather-response.model';
import { catchError, delay, of } from 'rxjs';
import { ErrorCardComponent } from '../../components/error-card/error-card.component';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tools } from '../../tools/Tools';
import { LoadingCardComponent } from '../../components/loading-card/loading-card.component';

@Component({
  selector: 'app-country',
  imports: [
    CommonModule,
    ErrorCardComponent,
    ToggleSwitch,
    ReactiveFormsModule,
    LoadingCardComponent,
    RouterLink
  ],
  templateUrl: './country.component.html'
})
export class CountryComponent {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  tools = Tools;

  country = signal<string>('');
  weather = signal<WeatherResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  isMetric = signal<boolean>(true);

  form = new FormGroup({
    unitControl: new FormControl(localStorage.getItem('isMetric') === 'true')
  });

  constructor() {
    this.route.params.subscribe((params) => {
      this.country.set(params['country']);
    });

    this.form.get('unitControl')?.valueChanges.subscribe((val) => {
      localStorage.setItem('isMetric', val ? 'true' : 'false');
      this.isMetric.set(val || false);
      this.loadWeather();
    });

    effect(() => {
      if (this.country()) {
        this.loadWeather();
      }
    });
  }

  protected loadWeather() {
    const units = this.isMetric() ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.country()}&APPID=794ee95e63c5a32aaf88cd813fa2e425&units=${units}`;

    this.loading.set(true);

    this.http
      .get<any>(url)
      .pipe(
        delay(500),
        catchError(() => {
          this.error.set('An error occurred while loading the weather.');
          return of(null);
        })
      )
      .subscribe((response) => {
        this.weather.set(response);
        if (response) {
          this.error.set(null);
        }
        this.loading.set(false);
      });
  }
}

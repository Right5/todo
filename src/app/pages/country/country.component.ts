import { Component, effect, inject, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../../models/weather-response.model';
import { catchError, delay, of } from 'rxjs';
import { ErrorCardComponent } from '../../components/error-card/error-card.component';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tools } from '../../tools/Tools';
import { LoadingCardComponent } from '../../components/loading-card/loading-card.component';

@Component({
  selector: 'app-country',
  imports: [
    CommonModule,
    Card,
    ErrorCardComponent,
    Button,
    ToggleSwitch,
    ReactiveFormsModule,
    LoadingCardComponent
  ],
  templateUrl: './country.component.html',
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
    unitControl: new FormControl(true)
  });

  constructor() {
    this.route.params.subscribe((params) => {
      this.country.set(params['country']);
    });

    this.form.get('unitControl')?.valueChanges.subscribe((val) => {
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
        catchError((error) => {
          this.error.set(error.message);
          return of(null);
        })
      )
      .subscribe((response) => {
        this.weather.set(response);
        this.loading.set(false);
      });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ErrorCardComponent } from '../../components/error-card/error-card.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, Card, ProgressSpinner, ErrorCardComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  countries = signal<Country[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.loading.set(true);

    this.http
      .get<any>('https://countriesnow.space/api/v0.1/countries')
      .pipe(
        catchError((error) => {
          this.error.set(error.message);
          return of([]);
        }),
        map((response) => response.data)
      )
      .subscribe((val: Country[]) => {
        this.countries.set(val);

        if (!val?.length) {
          this.error.set('No countries found.');
        }

        this.loading.set(false);
      });
  }

  selectCountry(country: any) {
    // Navigate to the weather page using the country name.
    this.router.navigate(['/countries', country.country]);
  }

  getCountryFlagLink(country: Country): string {
    return `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${country.iso2.toLowerCase()}.svg`;
  }
}

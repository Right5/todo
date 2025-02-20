import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, Card],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {
  http = inject(HttpClient);
  router = inject(Router);

  // Fetch countries from the API and convert the observable into a signal.
  countries$ = this.http.get<any>('https://countriesnow.space/api/v0.1/countries');
  countriesSignal = toSignal(this.countries$, { initialValue: { data: [] } });

  selectCountry(country: any) {
    // Navigate to the weather page using the country name.
    this.router.navigate(['/weather', country.country]);
  }
}

import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ErrorCardComponent } from '../../components/error-card/error-card.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, Card, ProgressSpinner, ErrorCardComponent],
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  // Full list of countries from API.
  countries = signal<Country[]>([]);
  // Only the currently displayed countries.
  displayedCountries = signal<Country[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Number of items to add per scroll.
  private itemsToShow = 20;

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
        } else {
          // Initially load the first batch.
          this.loadMore();
        }

        this.loading.set(false);
      });
  }

  // Load the next batch of countries into displayedCountries.
  loadMore() {
    const currentLength = this.displayedCountries().length;
    const nextBatch = this.countries().slice(currentLength, currentLength + this.itemsToShow);
    this.displayedCountries.update((prev) => [...prev, ...nextBatch]);
  }

  selectCountry(country: Country) {
    // Navigate to the weather page using the country name.
    this.router.navigate(['/countries', country.country]);
  }

  getCountryFlagLink(country: Country): string {
    return `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${country.iso2.toLowerCase()}.svg`;
  }

  // Listen to window scroll events.
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if we are at the bottom of the page.
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadMore();
    }
  }
}

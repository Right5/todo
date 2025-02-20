import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ErrorCardComponent } from '../../components/error-card/error-card.component';
import { catchError, debounceTime, map, of } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-countries',
  imports: [
    CommonModule,
    Card,
    ProgressSpinner,
    ErrorCardComponent,
    ReactiveFormsModule,
    InputText
  ],
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

  form = new FormGroup({
    searchControl: new FormControl('')
  });

  // Number of items to add per scroll.
  private itemsToShow = 20;

  ngOnInit() {
    this.loadCountries();

    // Listen for changes in the search input and filter countries.
    this.form.get('searchControl')?.valueChanges
      .pipe(debounceTime(220))
      .subscribe((value) => {
      this.filterCountries(value || '');
    });
  }

  loadCountries() {
    this.loading.set(true);

    this.http
      .get<any>('https://countriesnow.space/api/v0.1/countries')
      .pipe(
        catchError((error) => {
          this.error.set('failed to load countries');
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

  // Filter the countries based on the search term.
  filterCountries(searchTerm: string) {
    if (!searchTerm) {
      // If the search term is cleared, reset displayedCountries and load the initial batch.
      this.displayedCountries.set([]);
      this.loadMore();
    } else {
      const filtered = this.countries().filter((country) =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.displayedCountries.set(filtered);
    }
  }

  // Load the next batch of countries into displayedCountries (only when not filtering).
  loadMore() {
    if (this.form.get('searchControl')?.value) {
      // If a search term is active, don't use lazy loading.
      return;
    }
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
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.loadMore();
    }
  }
}

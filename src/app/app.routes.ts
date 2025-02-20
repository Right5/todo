import { Routes } from '@angular/router';
import { CountriesComponent } from './pages/countries/countries.component';
import { CountryComponent } from './pages/country/country.component';

export const routes: Routes = [
  { path: '', redirectTo: 'countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesComponent },
  { path: 'countries/:country', component: CountryComponent }
];

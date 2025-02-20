import { Routes } from '@angular/router';
import { CountriesComponent } from './pages/countries/countries.component';
import { WeatherComponent } from './pages/weather/weather.component';

export const routes: Routes = [
  { path: '', redirectTo: 'countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesComponent },
  { path: 'weather/:country', component: WeatherComponent }
];

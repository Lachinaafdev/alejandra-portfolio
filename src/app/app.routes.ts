import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CaseComponent } from './pages/case.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'caso/:slug', component: CaseComponent },
  { path: '**', redirectTo: '' },
];

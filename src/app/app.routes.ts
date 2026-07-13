import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CaseComponent } from './pages/case.component';
import { AiMethodComponent } from './pages/ai-method.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'caso/:slug', component: CaseComponent },
  { path: 'metodologia-ia', component: AiMethodComponent },
  { path: '**', redirectTo: '' },
];

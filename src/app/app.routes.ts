import { Routes } from '@angular/router';
import { CallComponent } from './pages/call/call.components';

export const routes: Routes = [
  { path: '', redirectTo: '/call', pathMatch: 'full' },
  { path: 'call', component: CallComponent },
];

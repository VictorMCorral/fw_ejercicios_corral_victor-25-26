import { Routes } from '@angular/router';
import { PrimerosPasos } from './c_pages/primeros-pasos/primeros-pasos';
import { FlexGrid } from './c_pages/flex-grid/flex-grid';
import { ResponsiveStates } from './c_pages/responsive-states/responsive-states';
import { Home } from './c_pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'primeros-pasos', component: PrimerosPasos },
  { path: 'flex-grid', component: FlexGrid },
  { path: 'responsive-states', component: ResponsiveStates },
];


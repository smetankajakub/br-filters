import { Routes } from '@angular/router';
import { FilterBuilderComponent } from './features/filter-builder/components/filter-builder/filter-builder.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/filter-builder',
    pathMatch: 'full'
  },
  {
    path: 'filter-builder',
    component: FilterBuilderComponent
  }
];

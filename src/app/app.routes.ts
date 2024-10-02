import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'list-pokemon', pathMatch: 'full' },
  {
    path: 'list-pokemon',
    loadComponent: () =>
      import('./modules/list-pokemon/list-pokemon.component').then(
        (m) => m.ListPokemonComponent
      ),
  },
];

import { Routes } from '@angular/router'

export const routes: Routes = [
	{ path: '', redirectTo: '', pathMatch: 'full' },
	{
		path: '',
		loadComponent: () =>
			import('./modules/list-pokemon/list-pokemon.component').then((m) => m.ListPokemonComponent),
	},
]

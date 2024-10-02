import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { computed } from '@angular/core'

import { Result } from './list-pokemon.type'
import { injectListPokemonService } from './list-pokemon.service'
import { pipe, tap, switchMap } from 'rxjs'
import { tapResponse } from '@ngrx/operators'

type ListPokemonState = {
	data: Result[]
	isLoading: boolean
	filter: { query: string; order: 'asc' | 'desc' }
}

const initialState: ListPokemonState = {
	data: [],
	isLoading: false,
	filter: { query: '', order: 'asc' },
}

export const ListPokemonStore = signalStore(
	withState(initialState),
	withComputed(({ data, filter }) => ({
		// Computed properties for the ListPokemon object
		// query: computed(() => filter().query),
	})),
	withMethods((store, service = injectListPokemonService()) => {
		return {
			getListBrands: rxMethod<void>(
				pipe(
					tap(() => patchState(store, { isLoading: true })),
					switchMap(() =>
						service.getListPokemon().pipe(
							tapResponse({
								next: (res) => {
									console.log(res.results)
									patchState(store, {
										data: res.results,
									})
								},
								error: () => {
									patchState(store, {
										data: [],
									})
								},
								finalize: () => patchState(store, { isLoading: false }),
							})
						)
					)
				)
			),
		}
	})
)

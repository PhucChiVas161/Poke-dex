import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { computed } from '@angular/core'

import { ListPokemonDetail, Result } from './list-pokemon.type'
import { injectListPokemonService } from './list-pokemon.service'
import { pipe, tap, switchMap, finalize } from 'rxjs'

type ListPokemonState = {
	dataDetail: ListPokemonDetail[]
	isLoading: boolean
	filter: { query: string; order: 'asc' | 'desc' }
}

const initialState: ListPokemonState = {
	dataDetail: [],
	isLoading: false,
	filter: { query: '', order: 'asc' },
}

export const ListPokemonStore = signalStore(
	withState(initialState),
	withComputed(({ dataDetail, filter }) => ({
		// Computed properties for the ListPokemon object
		// query: computed(() => filter().query),
	})),
	withMethods((store, service = injectListPokemonService()) => {
		return {
			getListPokemon: rxMethod<void>(
				pipe(
					tap(() => patchState(store, { isLoading: true })),
					switchMap(() =>
						service.getListPokemonWithDetails().pipe(
							tap((details) => {
								patchState(store, { dataDetail: details })
							}),
							finalize(() => patchState(store, { isLoading: false }))
						)
					)
				)
			),

			getTypePokemon: (id: number): string => {
				const pokemon = store.dataDetail().find((p) => p.id === id)
				return pokemon ? pokemon.types[0].type.name : ''
			},
		}
	})
)

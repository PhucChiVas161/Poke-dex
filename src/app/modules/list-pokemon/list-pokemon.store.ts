import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { computed } from '@angular/core'

import { ListPokemonDetail, PokemonTypes } from './list-pokemon.type'
import { injectListPokemonService } from './list-pokemon.service'
import { pipe, tap, switchMap, finalize } from 'rxjs'

type ListPokemonState = {
	dataDetail: ListPokemonDetail[]
	isLoading: boolean
	offset: number
}

const initialState: ListPokemonState = {
	dataDetail: [],
	isLoading: false,
	offset: 0,
}

export const ListPokemonStore = signalStore(
	withState(initialState),
	withComputed(({ dataDetail }) => ({
		// Computed properties for the ListPokemon object
		// query: computed(() => filter().query),
	})),
	withMethods((store, service = injectListPokemonService()) => {
		return {
			getListPokemon: rxMethod<void>(
				pipe(
					tap(() => patchState(store, { isLoading: true })),
					switchMap(() =>
						service.getListPokemonWithDetails(store.offset()).pipe(
							tap((details) => {
								patchState(store, {
									dataDetail: [...store.dataDetail(), ...details],
									offset: store.offset() + 50,
								})
							}),
							finalize(() => patchState(store, { isLoading: false }))
						)
					)
				)
			),

			getTypePokemon: (id: number | undefined): string => {
				const pokemon = store.dataDetail().find((p) => p.id === id)
				return pokemon ? pokemon.types[0].type.name : 'normal'
			},

			getTypePokemonImageUrl: (type: string | undefined): string => {
				const typeId = PokemonTypes[type as keyof typeof PokemonTypes]
				return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/${typeId}.png`
			},

			getPokemonImageUrl: (id: number | undefined): string => {
				return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`
			},
		}
	})
)

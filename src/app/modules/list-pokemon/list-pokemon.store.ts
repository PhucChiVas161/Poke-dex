import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { computed } from '@angular/core'

import { ListPokemonDetail, PokemonTypes } from './list-pokemon.type'
import { injectListPokemonService } from './list-pokemon.service'
import { pipe, tap, switchMap, finalize } from 'rxjs'

type ListPokemonState = {
	dataDetail: ListPokemonDetail[]
	isLoading: boolean
}

const initialState: ListPokemonState = {
	dataDetail: [],
	isLoading: false,
}

export const ListPokemonStore = signalStore(
	withState(initialState),
	withComputed(({ dataDetail }) => ({
		// Computed properties for the ListPokemon object
		// query: computed(() => filter().query),
	})),
	withMethods((store, service = injectListPokemonService()) => {
		return {
			getListPokemon: rxMethod<number>(
				pipe(
					tap(() => patchState(store, { isLoading: true })),
					switchMap((offset: number) =>
						service.getListPokemonWithDetails(offset).pipe(
							tap((details) => {
								patchState(store, { dataDetail: [...store.dataDetail(), ...details] })
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

			getTypePokemonImageUrl: (type: string): string => {
				const typeId = PokemonTypes[type as keyof typeof PokemonTypes]
				return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/${typeId}.png`
			},

			getPokemonImageUrl: (id: number): string => {
				return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`
			},
		}
	})
)

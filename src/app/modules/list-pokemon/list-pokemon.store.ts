import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { computed } from '@angular/core'

import { ListPokemonDetail, PokemonTypes, Result } from './list-pokemon.type'
import { injectListPokemonService } from './list-pokemon.service'
import { pipe, tap, switchMap, finalize, filter } from 'rxjs'

type ListPokemonState = {
	dataDetail: ListPokemonDetail[]
	pokemonFilter: Result[]
	isLoading: boolean
	offset: number
	searchPokemon: string | null | undefined
	changeSearchPokemon: string
}

const initialState: ListPokemonState = {
	dataDetail: [],
	pokemonFilter: [],
	isLoading: false,
	offset: 0,
	searchPokemon: null,
	changeSearchPokemon: '',
}

export const ListPokemonStore = signalStore(
	withState(initialState),
	withComputed((store) => ({
		filteredPokemon: computed(() => {
			const searchPokemon = store.searchPokemon()?.toLowerCase()
			return store.pokemonFilter().filter((pokemon) => pokemon.name.toLowerCase().includes(searchPokemon || ''))
		}),
	})),
	withMethods((store, service = injectListPokemonService()) => {
		return {
			setChangeSearch: (change: string) => {
				patchState(store, { changeSearchPokemon: change })
			},
			resetDataDetail: () => {
				patchState(store, { dataDetail: [], offset: 0, changeSearchPokemon: '', searchPokemon: null })
			},
			getListPokemon: rxMethod<void>(
				pipe(
					tap(() => patchState(store, { isLoading: true })),
					switchMap(() =>
						service.getListPokemonWithDetails(store.offset(), store.changeSearchPokemon()).pipe(
							tap((details) => {
								const newDataDetail = store.changeSearchPokemon()
									? details
									: [...store.dataDetail(), ...details]
								patchState(store, {
									dataDetail: newDataDetail,
									offset: store.offset() + 50,
								})
							}),
							finalize(() => patchState(store, { isLoading: false }))
						)
					)
				)
			),

			getListPokemonFilter: rxMethod<void>(
				pipe(
					tap(() => patchState(store, { isLoading: true })),
					switchMap(() =>
						service.getListPokemon().pipe(
							tap((filter) => {
								patchState(store, { pokemonFilter: filter.results })
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

			setSearchPokemon: (search: string | null | undefined) => {
				patchState(store, { searchPokemon: search })
			},
		}
	})
)

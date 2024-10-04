import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { forkJoin } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { createInjectionToken } from '~/core/utils/create-injection-token'
import { environment } from 'environments'
import { ListPokemon, ListPokemonDetail } from './list-pokemon.type'

export const [injectListPokemonService, provideListPokemonStore] = createInjectionToken(
	() => {
		const httpClient = inject(HttpClient)
		const baseApiUrl = environment().apiUrls

		return {
			getListPokemonWithDetails: (offset: number) => {
				return httpClient.get<ListPokemon>(`${baseApiUrl}/api/v2/pokemon/?offset=${offset}&limit=50`).pipe(
					switchMap((listPokemon) => {
						const detailRequests = listPokemon.results.map((result) =>
							httpClient.get<ListPokemonDetail>(`${baseApiUrl}/api/v2/pokemon/${result.name}`)
						)
						return forkJoin(detailRequests)
					})
				)
			},
		}
	},
	{ isRoot: true }
)

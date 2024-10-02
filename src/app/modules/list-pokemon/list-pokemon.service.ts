import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { of } from 'rxjs'

import { createInjectionToken } from '~/core/utils/create-injection-token'
import { environment } from 'environments'
import { ListPokemon, ListPokemonDetail } from './list-pokemon.type'

export const [injectListPokemonService, provideListPokemonStore] = createInjectionToken(
	() => {
		const httpClient = inject(HttpClient)
		const baseApiUrl = environment().apiUrls

		return {
			getListPokemon: () => {
				return httpClient.get<ListPokemon>(`${baseApiUrl}/api/v2/pokemon/`)
			},
			getListPokemonDetail: (url: string | undefined) => {
				return httpClient.get<ListPokemonDetail>(`${url}`)
			},
		}
	},
	{ isRoot: true }
)

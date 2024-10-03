import { Component, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [],
	templateUrl: './list-pokemon.component.html',
	styleUrl: `./list-pokemon.component.scss`,
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)
	protected pokemonTypes: string = ''

	ngOnInit() {
		this.store.getListPokemon()
	}
}

import { Component, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [],
	templateUrl: './list-pokemon.component.html',
	styles: ``,
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)

	ngOnInit() {
		this.store.getListBrands()
	}
}

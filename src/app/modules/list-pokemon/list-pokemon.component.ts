import { Component, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'
import { SpinnerComponent } from '~/shared/spinner/spinner.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [SpinnerComponent, InfiniteScrollDirective],
	templateUrl: './list-pokemon.component.html',
	styleUrl: './list-pokemon.component.scss',
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)
	protected pokemonTypes: string = ''
	protected offset: number = 0

	ngOnInit() {
		this.store.getListPokemon(this.offset)
	}

	onScrollDown(): void {
		console.log('object')
		this.offset += 20
		this.store.getListPokemon(this.offset)
	}
}

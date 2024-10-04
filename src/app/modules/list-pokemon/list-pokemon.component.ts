import { Component, HostListener, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'
import { SpinnerComponent } from '~/shared/spinner/spinner.component'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [SpinnerComponent],
	templateUrl: './list-pokemon.component.html',
	styleUrl: `./list-pokemon.component.scss`,
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)
	protected pokemonTypes: string = ''
	protected offset: number = 0

	ngOnInit() {
		this.store.getListPokemon(this.offset)
	}

	@HostListener('window:scroll', [])
	onScroll(): void {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			this.offset += 20
			this.store.getListPokemon(this.offset)
		}
	}
}

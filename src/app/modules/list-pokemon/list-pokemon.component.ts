import { Component, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'
import { SpinnerComponent } from '~/shared/spinner/spinner.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { CommonModule } from '@angular/common'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [SpinnerComponent, InfiniteScrollDirective, CommonModule],
	templateUrl: './list-pokemon.component.html',
	styleUrl: './list-pokemon.component.scss',
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)

	ngOnInit() {
		this.store.getListPokemon()
	}

	onScrollDown(): void {
		this.store.getListPokemon()
	}
}

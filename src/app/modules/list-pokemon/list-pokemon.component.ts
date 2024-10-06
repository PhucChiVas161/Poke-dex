import { Component, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'
import { SpinnerComponent } from '~/shared/spinner/spinner.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [SpinnerComponent, InfiniteScrollDirective, CommonModule, MatIconModule],
	templateUrl: './list-pokemon.component.html',
	styleUrl: './list-pokemon.component.scss',
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)

	ngOnInit() {
		this.store.getListPokemon()
		this.setInitialTheme()
	}

	onScrollDown(): void {
		this.store.getListPokemon()
	}

	toggleTheme() {
		if (localStorage.getItem('color-theme')) {
			if (localStorage.getItem('color-theme') === 'light') {
				this.setDarkTheme()
			} else {
				this.setLightTheme()
			}
		} else {
			if (document.documentElement.classList.contains('dark')) {
				this.setLightTheme()
			} else {
				this.setDarkTheme()
			}
		}
	}

	private setInitialTheme() {
		if (
			localStorage.getItem('color-theme') === 'dark' ||
			(!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			this.setDarkTheme()
		} else {
			this.setLightTheme()
		}
	}

	private setDarkTheme() {
		document.documentElement.classList.add('dark')
		localStorage.setItem('color-theme', 'dark')
	}

	private setLightTheme() {
		document.documentElement.classList.remove('dark')
		localStorage.setItem('color-theme', 'light')
	}

	private isDarkTheme() {
		return document.documentElement.classList.contains('dark')
	}
}

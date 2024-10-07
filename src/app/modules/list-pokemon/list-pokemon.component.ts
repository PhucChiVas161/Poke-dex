import { ChangeDetectorRef, Component, inject } from '@angular/core'
import { ListPokemonStore } from './list-pokemon.store'
import { SpinnerComponent } from '~/shared/spinner/spinner.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { filter, map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs'
import { MatAutocompleteModule } from '@angular/material/autocomplete'

@Component({
	selector: 'app-list-pokemon',
	standalone: true,
	imports: [
		SpinnerComponent,
		InfiniteScrollDirective,
		CommonModule,
		MatIconModule,
		FormsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
	],
	templateUrl: './list-pokemon.component.html',
	styleUrl: './list-pokemon.component.scss',
	providers: [ListPokemonStore],
})
export class ListPokemonComponent {
	protected readonly store = inject(ListPokemonStore)
	protected readonly _changeDetectorRef = inject(ChangeDetectorRef)
	private readonly destroy$ = new Subject<void>()
	isDarkMode: boolean = false
	filterPokemon = new FormControl('')
	options: string[] = []

	ngOnInit() {
		this.store.getListPokemon()
		this.setInitialTheme()
		this.store.getListPokemonFilter()
		this.filterPokemon?.valueChanges
			.pipe(
				takeUntil(this.destroy$),
				tap((value) => {
					this.store.setSearchPokemon(value)
				}),
				filter((input) => !input)
			)
			.subscribe(() => {
				this.store.resetDataDetail()
				this.store.getListPokemon()
			})
	}

	onScrollDown(): void {
		this.store.getListPokemon()
	}

	selectedPokemon(pokemon: string) {
		this.store.setChangeSearch(pokemon)
		this.store.getListPokemon()
		this._changeDetectorRef.markForCheck()
	}

	toggleTheme() {
		const currentTheme = localStorage.getItem('color-theme')
		const isDarkMode = document.documentElement.classList.contains('dark')

		if (currentTheme === 'light' || (!currentTheme && !isDarkMode)) {
			this.setDarkTheme()
		} else {
			this.setLightTheme()
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
		this.isDarkMode = true
	}

	private setLightTheme() {
		document.documentElement.classList.remove('dark')
		localStorage.setItem('color-theme', 'light')
		this.isDarkMode = false
	}
}

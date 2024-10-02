
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

import { ListPokemon } from './list-pokemon.type';
import { injectListPokemonService } from './list-pokemon.service';

type ListPokemonState = {
  data: ListPokemon;
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ListPokemonState = {
  data: {} as ListPokemon,
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ListPokemonStore = signalStore(
  withState(initialState),
  withComputed(({ data, filter }) => ({
    // Computed properties for the ListPokemon object
    // query: computed(() => filter().query),
  })),
  withMethods((store, service = injectListPokemonService()) => ({
    // increment1(): void {
    //   patchState(store, { count1: store.count1() + 1 });
    // },
  })),
);

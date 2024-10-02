interface Environment {
	apiUrls: string
}

export const environmentData: Record<string, Environment> = {
	local: {
		apiUrls: 'https://pokeapi.co',
	},
}

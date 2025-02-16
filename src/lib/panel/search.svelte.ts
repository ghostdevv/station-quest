import { VERSION } from '$lib/version';

interface SearchResult {
	latitude: number;
	longitude: number;
	osm_id: number;
	rank: number;
	name?: string;
	railway?: 'station' | 'junction' | 'halt' | 'yard' | 'tram_stop';
	operator?: string;
}

class Search {
	#results = $state<SearchResult[]>([]);
	#abortController = $state<AbortController | null>(null);

	get results() {
		return this.#results;
	}

	get searching() {
		return !!this.#abortController;
	}

	async search(query: string) {
		this.#abortController?.abort('new query');

		if (query.length === 0) {
			console.log('Skipping search');
			this.#results = [];
			return;
		}

		console.log(`Searching "${query}"`);

		const controller = new AbortController();
		this.#abortController = controller;

		const url = new URL('https://api.openrailwaymap.org/v2/facility');
		url.searchParams.set('name', query);

		const response = await fetch(url, {
			signal: controller.signal,
			headers: {
				'user-agent': `StationQuest/${VERSION} (+https://github.com/danstewart/StationQuest)`,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch search results');
		}

		if (controller.signal.aborted) {
			return;
		}

		const data: SearchResult[] = await response.json();

		this.#results = data;
		this.#abortController = null;

		console.log('Search Results:', { query, data });
	}
}

export const search = new Search();

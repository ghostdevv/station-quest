import { VERSION } from '$lib/version';

interface SearchResult {
	latitude: number;
	longitude: number;
	osm_id: number;
	rank: number;
	name?: string;
	railway?: 'station' | 'junction' | 'halt' | 'yard';
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
				'user-agent': `StationRecord/${VERSION} (+https://github.com/danstewart/StationRecord)`,
			},
		});

		if (!response.ok) {
			// todo
			return;
		}

		if (controller.signal.aborted) {
			// todo
			return;
		}

		this.#results = await response.json();
	}
}

export const search = new Search();

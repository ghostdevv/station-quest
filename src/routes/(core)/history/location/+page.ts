import { countVisitsByStation } from '../utils';
import { visitsDb } from '$lib/storage.svelte';

export async function load() {
	return {
		visits: visitsDb.list().then((visits) => countVisitsByStation(visits)),
	};
}

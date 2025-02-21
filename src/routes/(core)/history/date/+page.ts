import { countVisitsByStation } from '../utils';
import { visitsDb } from '$lib/storage.svelte';

export async function load() {
	return {
		dates: visitsDb.list().then((visits) => {
			const dates = Object.entries(
				Object.groupBy(visits, (visit) => visit.date),
			);

			return dates
				.map(([date, visits]) => ({
					date: new Date(date),
					count: visits!.length,
					visits: countVisitsByStation(visits!),
				}))
				.sort((a, b) => b.date.getTime() - a.date.getTime());
		}),
	};
}

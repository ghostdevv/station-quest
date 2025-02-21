import type { VisitsListResult } from '$lib/storage.svelte';

export function countVisitsByStation(visits: VisitsListResult) {
	const counts = new Map<string, number>();

	for (const visit of visits) {
		const current = counts.get(visit.station.name) || 0;
		counts.set(visit.station.name, current + 1);
	}

	return counts
		.entries()
		.toArray()
		.sort(([, a], [, b]) => b - a);
}

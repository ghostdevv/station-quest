import { Dexie, type EntityTable } from 'dexie';

const db = new Dexie('station-quest') as Dexie & {
	visits: EntityTable<Visit, 'id'>;
	station: EntityTable<Station, 'id'>;
};

export const VISIT_TYPES = Object.freeze([
	'alighted',
	'boarded',
	'pass',
	'transferred',
	'unknown',
] as const);

export type VisitType = (typeof VISIT_TYPES)[number];

export interface Visit {
	id: number;
	stationId: number;
	date: string;
	type: VisitType;
}

export interface Station {
	id: number;
	name: string;
	osmId: number;
	lat: number;
	lng: number;
}

db.version(1).stores({
	visits: '++id, stationId, date',
	station: '++id, name, osmId, lat, lng',
});

db.version(2)
	.stores({
		visits: '++id, stationId, date, type',
		station: '++id, name, osmId, lat, lng',
	})
	.upgrade(async (tx) => {
		await tx
			.table('visits')
			.toCollection()
			.modify((visit) => {
				visit.type = 'unknown';
			});
	});

class StationsDb {
	async get(stationId: number) {
		return (await db.station.get(stationId)) || null;
	}

	async getOrCreate(station: Omit<Station, 'id'>) {
		const existing = await db.station
			.where('osmId')
			.equals(station.osmId)
			.or('name')
			.equals(station.name)
			.first();

		if (existing) {
			return existing;
		}

		const id = await db.station.add(station);
		return (await this.get(id))!;
	}

	async add(station: Omit<Station, 'id'>) {
		await db.station.add(station);
	}
}

export const stationsDb = new StationsDb();

export type VisitsListResult = (Visit & { station: Station })[];

class VisitsDb {
	async get(id: number) {
		return (await db.visits.get(id)) || null;
	}

	async add(visit: Omit<Visit, 'id'>) {
		const id = await db.visits.add(visit);
		return (await this.get(id))!;
	}

	async list() {
		const visits: VisitsListResult = [];

		for (const visit of await db.visits.toArray()) {
			const station = await stationsDb.get(visit.stationId);
			visits.push({ ...visit, station: station! });
		}

		return visits;
	}
}

export const visitsDb = new VisitsDb();

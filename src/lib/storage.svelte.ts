import { Dexie, type EntityTable } from 'dexie';

export const db = new Dexie('station-quest') as Dexie & {
	visits: EntityTable<Visit, 'id'>;
	station: EntityTable<Station, 'id'>;
};

interface Visit {
	id: number;
	stationId: number;
	date: string;
}

interface Station {
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

// class Stations {
// 	async add(station: Omit<Station, 'id'>) {
// 		await db.station.add(station);
// 	}
// }

// class Visits {
// 	async add(visit: Omit<Visit, 'id'>) {
// 		await db.visits.add(visit);
// 	}
// }

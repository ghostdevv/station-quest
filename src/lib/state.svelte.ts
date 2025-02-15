/// <reference types="svelte-maplibre-gl" />

export type Direction = 'vertical' | 'horizontal';

interface Context {
	map: maplibregl.Map | null;
	direction: Direction;
}

export const ctx = $state<Context>({ map: null, direction: 'horizontal' });

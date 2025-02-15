/// <reference types="svelte-maplibre-gl" />

interface Context {
	map: maplibregl.Map | null;
}

export const ctx = $state<Context>({ map: null });

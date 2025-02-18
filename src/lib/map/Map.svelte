<script lang="ts">
	import './map.scss';
	import IconTrack from 'lucide-svelte/icons/train-track';
	import IconAntenna from 'lucide-svelte/icons/antenna';
	import IconGauge from 'lucide-svelte/icons/gauge';
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconSun from 'lucide-svelte/icons/sun';
	import { ctx } from '$lib/state.svelte';
	import { onMount, tick } from 'svelte';
	import {
		MapLibre,
		NavigationControl,
		ScaleControl,
		GlobeControl,
		RasterTileSource,
		RasterLayer,
		CustomControl,
		GeolocateControl,
		AttributionControl,
	} from 'svelte-maplibre-gl';

	const RAIL_STYLES = ['standard', 'signals', 'maxspeed'];

	let mapTheme = $state<'light' | 'dark'>('light');
	let railStyle = $state('standard');

	function nextStyle() {
		const index = RAIL_STYLES.indexOf(railStyle);
		railStyle = RAIL_STYLES[(index + 1) % RAIL_STYLES.length];
	}

	let mainControlPosition: maplibregl.ControlPosition = $derived(
		ctx.direction == 'horizontal' ? 'top-left' : 'bottom-right',
	);

	let map = $state<maplibregl.Map>();

	$effect(() => {
		ctx.map = map || null;
	});

	onMount(async () => {
		await tick();
		map?.resize();
	});
</script>

<MapLibre
	bind:map
	class="map"
	style={mapTheme === 'light'
		? 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
		: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'}
	zoom={4}
	center={{ lng: -0.114, lat: 51.503 }}
	attributionControl={false}>
	{#if ctx.direction == 'vertical'}
		<CustomControl class="title" position="bottom-left">
			<p>StationQuest</p>
		</CustomControl>
	{/if}

	<ScaleControl position="bottom-left" />
	<AttributionControl compact position="top-right" />
	<NavigationControl position={mainControlPosition} />
	<GlobeControl position={mainControlPosition} />
	<GeolocateControl position={mainControlPosition} />
	<CustomControl position={mainControlPosition}>
		<button title="Map Style: {railStyle}" onclick={nextStyle}>
			{#if railStyle === 'standard'}
				<IconTrack color="#333" size="22" />
			{:else if railStyle === 'signals'}
				<IconAntenna color="#333" size="22" />
			{:else if railStyle === 'maxspeed'}
				<IconGauge color="#333" size="22" />
			{/if}
		</button>
	</CustomControl>
	<CustomControl position={mainControlPosition}>
		<button
			title="Change theme to {mapTheme === 'light' ? 'dark' : 'light'}"
			onclick={() => {
				mapTheme = mapTheme === 'light' ? 'dark' : 'light';
			}}>
			{#if mapTheme === 'light'}
				<IconMoon color="#333" size="22" />
			{:else}
				<IconSun color="#333" size="22" />
			{/if}
		</button>
	</CustomControl>

	<RasterTileSource
		id="railway"
		attribution={`<a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> (<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a>)`}
		tiles={[
			`https://a.tiles.openrailwaymap.org/${railStyle}/{z}/{x}/{y}.png`,
			`https://b.tiles.openrailwaymap.org/${railStyle}/{z}/{x}/{y}.png`,
			`https://c.tiles.openrailwaymap.org/${railStyle}/{z}/{x}/{y}.png`,
		]}
		tileSize={256}>
		<RasterLayer id="railway-layer" source="railway" />
	</RasterTileSource>
</MapLibre>

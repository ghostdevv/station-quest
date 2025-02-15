<script lang="ts">
	import './map.scss';
	import IconTrack from 'lucide-svelte/icons/train-track';
	import IconAntenna from 'lucide-svelte/icons/antenna';
	import IconGauge from 'lucide-svelte/icons/gauge';
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

	const STYLES = ['standard', 'signals', 'maxspeed'];
	let style = $state('standard');

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
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={4}
	center={{ lng: -0.114, lat: 51.503 }}
	attributionControl={false}>
	<ScaleControl position="bottom-left" />
	<AttributionControl compact position="top-right" />
	<NavigationControl position={mainControlPosition} />
	<GlobeControl position={mainControlPosition} />
	<GeolocateControl position={mainControlPosition} />
	<CustomControl position={mainControlPosition}>
		<button
			title="Map Style: {style}"
			onclick={() => {
				style = STYLES[(STYLES.indexOf(style) + 1) % STYLES.length];
			}}>
			{#if style === 'standard'}
				<IconTrack color="#333" size="22" />
			{:else if style === 'signals'}
				<IconAntenna color="#333" size="22" />
			{:else if style === 'maxspeed'}
				<IconGauge color="#333" size="22" />
			{/if}
		</button>
	</CustomControl>

	<RasterTileSource
		id="railway"
		attribution={`<a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> (<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a>)`}
		tiles={[
			`https://a.tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`,
			`https://b.tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`,
			`https://c.tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`,
		]}
		tileSize={256}>
		<RasterLayer id="railway-layer" source="railway" />
	</RasterTileSource>
</MapLibre>

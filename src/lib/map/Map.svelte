<script lang="ts">
	import './map.scss';
	import IconTrack from 'lucide-svelte/icons/train-track';
	import IconAntenna from 'lucide-svelte/icons/antenna';
	import IconGauge from 'lucide-svelte/icons/gauge';
	import {
		MapLibre,
		NavigationControl,
		ScaleControl,
		GlobeControl,
		RasterTileSource,
		RasterLayer,
		CustomControl,
		FullScreenControl,
		GeolocateControl,
	} from 'svelte-maplibre-gl';

	const STYLES = ['standard', 'signals', 'maxspeed'];

	let style = $state('standard');
</script>

<MapLibre
	class="map"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={4}
	center={{ lng: -0.114, lat: 51.503 }}>
	<NavigationControl />
	<ScaleControl />
	<GlobeControl />
	<FullScreenControl />
	<GeolocateControl />
	<RasterTileSource
		id="railway"
		attribution={`Data <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>`}
		tiles={[
			`https://a.tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`,
			`https://b.tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`,
			`https://c.tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`,
		]}
		tileSize={256}>
		<RasterLayer id="railway-layer" source="railway" />
	</RasterTileSource>
	<CustomControl position="top-right">
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
</MapLibre>

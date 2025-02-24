<script lang="ts">
	import IconGitHub from 'lucide-svelte/icons/github';
	import { VERSION } from '$lib/version';
</script>

<h2>Station Quest <span class="version">v{VERSION}</span></h2>

<p>
	StationQuest is an app for exploring the train networks in the world, and
	recording visits to them. It came about from wanting a nice way to record
	the stations you visit, in the hope for
	<a href="http://ghostdev.xyz">Willow</a>
	to eventually visit everyone in the UK. We completely rely on data from
	<a href="https://wiki.openstreetmap.org/wiki/OpenRailwayMap">
		Open Railway Map
	</a>
	so please donate to them if you find this useful.
</p>

<p>
	If you have any problems please make an issue on the
	<a href="https://github.com/ghostdevv/station-quest">GitHub</a>,
	contributions are welcome! This is also where you'll be able to find planned
	features.
</p>

<section class="row">
	<a href="https://github.com/ghostdevv/station-quest">
		<IconGitHub size={18} />
	</a>
</section>

<style>
	.version {
		font-size: 1rem;
		color: var(--text-grey);
	}

	p {
		line-height: 1.6;
	}
</style>

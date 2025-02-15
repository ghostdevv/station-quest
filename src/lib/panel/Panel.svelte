<script lang="ts">
	import { search } from './search.svelte';
	import { ctx } from '$lib/state.svelte';
	import { VERSION } from '$lib/version';
	import { Debounced } from 'runed';
	import { untrack } from 'svelte';

	let searchQuery = $state('');
	const debouncedSearch = new Debounced(() => searchQuery);

	$effect(() => {
		if (debouncedSearch.current) {
			untrack(() => search.search(debouncedSearch.current));
		}
	});
</script>

<div class="panel">
	<header>
		<h3>StationRecord</h3>
		<small>v{VERSION}</small>
		<hr />
	</header>

	<input type="search" bind:value={searchQuery} />

	<div class="results">
		{#each search.results as station}
			<button
				class="icon result"
				onclick={() => {
					ctx.map?.flyTo({
						center: [station.latitude, station.longitude],
						zoom: 15,
					});
				}}>
				<strong>{station.name}</strong>
				<small>({station.railway})</small>
			</button>
		{/each}
	</div>
</div>

<style>
	.panel {
		background-color: var(--background-secondary);
		border-radius: 12px;
		height: 100%;
		padding: 22px;
		min-width: 240px;

		header {
			h3 {
				display: inline-block;
			}

			small {
				color: var(--text-grey);
			}
		}
	}

	.results {
		display: flex;
		flex-direction: column;
		margin: 8px 0px;
		gap: 8px;

		.result {
			text-align: left;
			text-transform: capitalize;
		}
	}
</style>

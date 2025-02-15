<script lang="ts">
	import { search } from './search.svelte';
	import { ctx } from '$lib/state.svelte';
	import { VERSION } from '$lib/version';
	import { Debounced } from 'runed';
	import { untrack } from 'svelte';

	let searchQuery = $state('');
	const debouncedSearch = new Debounced(() => searchQuery.trim());

	$effect(() => {
		debouncedSearch.current;
		untrack(() => search.search(debouncedSearch.current));
	});
</script>

<div class="panel">
	<header>
		<h4>StationRecord</h4>
		<small>v{VERSION}</small>
	</header>

	<input type="search" placeholder="Search..." bind:value={searchQuery} />

	<div class="results">
		{#if search.searching}
			<p>Searching...</p>
		{:else}
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
					<small>({station.railway?.replaceAll('_', ' ')})</small>
				</button>
			{/each}
		{/if}
	</div>
</div>

<style>
	.panel {
		background-color: var(--background-secondary);
		border-radius: 12px;
		height: 100%;
		max-height: 100%;
		padding: 22px;
		min-width: 240px;

		display: flex;
		flex-direction: column;
		gap: 12px;

		header {
			h4 {
				display: inline-block;
			}

			small {
				display: inline-block;
				color: var(--text-grey);
			}
		}
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 8px;

		max-height: 100%;
		overflow: auto;
		flex-grow: 1;

		.result {
			text-align: left;
			text-transform: capitalize;
		}
	}
</style>

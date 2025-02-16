<script lang="ts">
	import { search } from './search.svelte';
	import { ctx } from '$lib/state.svelte';
	import { Debounced } from 'runed';
	import { untrack } from 'svelte';

	let searchQuery = $state('');
	const debouncedSearch = new Debounced(() => searchQuery.trim());

	let searchPromise = $state<Promise<any>>(Promise.resolve());

	$effect(() => {
		debouncedSearch.current;
		untrack(() => {
			searchPromise = search.search(debouncedSearch.current);
		});
	});

	let online = $state(true);
</script>

<input type="search" placeholder="Search..." bind:value={searchQuery} />

<div class="results">
	{#await searchPromise}
		<p>Searching...</p>
	{:then}
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
	{:catch error}
		<p><small>{error}</small></p>
	{/await}
</div>

<style>
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

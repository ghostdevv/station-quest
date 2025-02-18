<script lang="ts">
	import IconLocate from 'lucide-svelte/icons/map-pin';
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
			<details class="result">
				<summary>
					<strong>{station.name}</strong>
					<small>({station.railway?.replaceAll('_', ' ')})</small>
				</summary>

				<div class="controls">
					<button
						class="icon"
						onclick={() => {
							ctx.map?.flyTo({
								center: [station.latitude, station.longitude],
								zoom: 15,
							});
						}}>
						<IconLocate size={18} />
					</button>
				</div>
			</details>
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
			summary {
				text-align: left;
				text-transform: capitalize;
				transition: color 0.2s ease-in-out;
				cursor: pointer;
			}

			summary:hover,
			&:focus-visible summary {
				color: var(--primary);
			}

			.controls {
				padding: 4px 12px;
			}
		}
	}
</style>

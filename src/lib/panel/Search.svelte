<script lang="ts">
	import SearchResult from './SearchResult.svelte';
	import { search } from './search.svelte';
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
			<SearchResult {station} />
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
	}
</style>

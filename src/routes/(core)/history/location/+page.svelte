<script lang="ts">
	let { data } = $props();
</script>

{#await data.visits}
	<p>Loading...</p>
{:then visits}
	{#each visits as [stationName, count]}
		<div class="visit">
			<p>{stationName}</p>
			<p>{count}</p>
		</div>
	{:else}
		<p>No visits found :(</p>
	{/each}
{:catch error}
	<p>Error loading visits: {error.message}</p>
{/await}

<style lang="scss">
	.visit {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>

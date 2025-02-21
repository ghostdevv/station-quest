<script lang="ts">
	import { format } from 'date-fns';
	let { data } = $props();
</script>

{#await data.dates}
	<p>Loading...</p>
{:then dates}
	{#each dates as { date, count, visits }}
		<details>
			<summary>
				<span>{format(date, 'do MMMM yyyy')}</span>
				<!-- <span class="count">{count}</span> -->
			</summary>

			{#each visits as [stationName, count]}
				<div class="visit">
					<p>{stationName}</p>
					<p>{count}</p>
				</div>
			{:else}
				<p>No visits found :(</p>
			{/each}
		</details>
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

	details {
		margin-bottom: 8px;

		summary {
			transition: color 0.2s ease-in-out;
			cursor: pointer;

			&:hover,
			&:focus-visible {
				color: var(--primary);
			}
		}
	}
</style>

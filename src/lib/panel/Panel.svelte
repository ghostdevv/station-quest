<script lang="ts">
	import IconOffline from 'lucide-svelte/icons/wifi-off';
	import { VERSION } from '$lib/version';
	import Search from './Search.svelte';

	let online = $state(true);
</script>

<svelte:window bind:online />

<div class="panel">
	<header>
		<h4 class="title">
			StationQuest
			<span class="version">v{VERSION}</span>
		</h4>

		{#if !online}
			<div title="You're offline">
				<IconOffline color="var(--red)" size={18} />
			</div>
		{/if}
	</header>

	<svelte:boundary>
		<Search />

		{#snippet failed(error, reset)}
			<p><small>{error}</small></p>
			<button class="icon" onclick={reset}>retry</button>
		{/snippet}
	</svelte:boundary>
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
	}

	header {
		display: flex;
		align-items: center;
		width: 100%;

		.title {
			margin-right: auto;

			.version {
				font-size: 0.9rem;
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

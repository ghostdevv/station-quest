<script lang="ts">
	import IconOffline from 'lucide-svelte/icons/wifi-off';
	import IconSeaarch from 'lucide-svelte/icons/search';
	import { ctx } from '$lib/state.svelte';
	import { VERSION } from '$lib/version';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	let online = $state(true);
</script>

<svelte:window bind:online />

<div class="panel" class:side-nav={ctx.direction == 'vertical'}>
	{#if ctx.direction == 'horizontal'}
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
	{/if}

	<div class="content">
		{@render children()}
	</div>

	<div class="tabs">
		<a
			href="/search"
			title="Search"
			class="button icon"
			class:active={page.url.pathname.startsWith('/search')}>
			<IconSeaarch />
		</a>

		{#if ctx.direction == 'vertical'}
			<p class="version">v{VERSION}</p>
		{/if}
	</div>
</div>

<style>
	.panel {
		background-color: var(--background-secondary);
		border-radius: 12px;
		height: 100%;
		max-height: 100%;
		padding: 12px 10px;
		min-width: 240px;

		display: grid;
		gap: 12px;
		grid-template-rows: max-content 1fr max-content;
		grid-template-columns: 1fr;
		grid-template-areas: 'header' 'content' 'tabs';

		&.side-nav {
			grid-template-columns: 1fr max-content;
			grid-template-rows: 1fr;
			grid-template-areas: 'content tabs';
		}
	}

	header {
		display: flex;
		align-items: center;
		width: 100%;
		grid-area: header;

		padding: 4px;

		.title {
			margin-right: auto;
		}
	}

	.version {
		font-size: 0.9rem;
		color: var(--text-grey);
	}

	.content {
		width: 100%;
		height: 100%;
		grid-area: content;
	}

	.tabs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--background-tertiary);
		border-radius: 12px;
		padding: 12px;
		grid-area: tabs;
	}

	.panel.side-nav .tabs {
		flex-direction: column;
		justify-content: flex-start;
		gap: 16px;

		.version {
			margin-top: auto;
		}
	}
</style>

<script lang="ts">
	import IconOffline from 'lucide-svelte/icons/wifi-off';
	import IconSearch from 'lucide-svelte/icons/search';
	import IconInfo from 'lucide-svelte/icons/info';
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

{#snippet offlineIndicator()}
	{#if !online}
		<div title="You're offline">
			<IconOffline color="var(--red)" size={18} />
		</div>
	{/if}
{/snippet}

<div class="panel" class:side-nav={ctx.direction == 'vertical'}>
	<div class="content">
		{@render children()}
	</div>

	<div class="tabs">
		<a
			href="/search"
			title="Search"
			class="button icon"
			class:active={page.url.pathname.startsWith('/search')}>
			<IconSearch />
		</a>

		<a
			href="/about"
			title="About"
			class="button icon"
			class:active={page.url.pathname.startsWith('/about')}>
			<IconInfo />
		</a>

		{#if ctx.direction == 'vertical'}
			{@render offlineIndicator()}
			<p class="version">v{VERSION}</p>
		{/if}
	</div>

	{#if ctx.direction == 'horizontal'}
		<div class="footer">
			<p class="version"><strong>StationQuest</strong> v{VERSION}</p>
			{@render offlineIndicator()}
		</div>
	{/if}
</div>

<style>
	.panel {
		background-color: var(--background-secondary);
		border-radius: 12px;
		height: 100%;
		max-height: 100%;
		padding: 10px;
		min-width: 240px;

		display: grid;
		gap: 12px;
		grid-template-rows: max-content 1fr max-content;
		grid-template-columns: 1fr;
		grid-template-areas: 'tabs' 'content' 'footer';

		&.side-nav {
			grid-template-columns: 1fr max-content;
			grid-template-rows: 1fr;
			grid-template-areas: 'content tabs';
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

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 2px solid var(--background-tertiary);
		padding-top: 10px;
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

		a:last-of-type {
			margin-bottom: auto;
		}
	}
</style>

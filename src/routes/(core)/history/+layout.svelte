<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="page">
	<div class="sort">
		<a
			class="button"
			href="/history/location"
			class:active={page.url.pathname == `/history/location`}>
			Location
		</a>

		<a
			class="button"
			href="/history/date"
			class:active={page.url.pathname == `/history/date`}>
			Date
		</a>
	</div>

	<div class="data">
		{@render children()}
	</div>
</div>

<style lang="scss">
	.page {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: max-content 1fr;
		height: 100%;
	}

	.sort {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		gap: 8px;

		a {
			display: grid;
			place-items: center;
			width: 100%;

			background-color: var(--background-tertiary);
			border-color: var(--background-tertiary);
			border-radius: 12px;
			padding: 8px;

			&:hover,
			&.active {
				border-color: var(--primary);
				text-decoration: none;
			}
		}
	}

	.data {
		overflow: auto;
		padding: 8px;
	}
</style>

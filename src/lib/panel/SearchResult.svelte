<script lang="ts">
	import IconLocate from 'lucide-svelte/icons/map-pin';
	import IconView from 'lucide-svelte/icons/telescope';
	import type { SearchResult } from './search.svelte';
	import { Inspect } from 'svelte-inspect-value';
	import { ctx } from '$lib/state.svelte';
	import Modal from '$lib/Modal.svelte';

	interface Props {
		station: SearchResult;
	}

	const { station }: Props = $props();
</script>

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

		<Modal>
			{#snippet activator()}
				<button class="icon">
					<IconView size={18} />
				</button>
			{/snippet}

			{#snippet children()}
				<Inspect value={station} />
			{/snippet}
		</Modal>
	</div>
</details>

<style>
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
</style>

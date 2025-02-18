<script lang="ts">
	import IconLocate from 'lucide-svelte/icons/map-pin';
	import IconView from 'lucide-svelte/icons/telescope';
	import type { SearchResult } from './search.svelte';
	import { Inspect } from 'svelte-inspect-value';
	import { ctx } from '$lib/state.svelte';

	interface Props {
		station: SearchResult;
	}

	const { station }: Props = $props();

	let inspectDialog = $state<HTMLDialogElement>();

	// Based on code from https://stackoverflow.com/a/57463812
	function click(event: MouseEvent) {
		if (!inspectDialog || event.target != inspectDialog) return;

		const rect = inspectDialog.getBoundingClientRect();

		const clickedInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;

		if (clickedInDialog === false) {
			inspectDialog?.close();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog bind:this={inspectDialog} onclick={click}>
	<Inspect value={station} />
</dialog>

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

		<button
			class="icon"
			onclick={() => {
				inspectDialog?.showModal();
			}}>
			<IconView size={18} />
		</button>
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

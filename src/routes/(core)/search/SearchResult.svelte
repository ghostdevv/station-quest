<script lang="ts">
	import { stationsDb, visitsDb } from '$lib/storage.svelte';
	import IconLocate from 'lucide-svelte/icons/map-pin';
	import IconView from 'lucide-svelte/icons/telescope';
	import type { SearchResult } from './search.svelte';
	import IconAdd from 'lucide-svelte/icons/plus';
	import { Inspect } from 'svelte-inspect-value';
	import { ctx } from '$lib/state.svelte';
	import Modal from '$lib/Modal.svelte';

	interface Props {
		station: SearchResult;
	}

	const { station }: Props = $props();

	let visitModalOpen = $state(false);
	let addingVisit = $state(false);

	type SvelteSubmitEvent = SubmitEvent & { currentTarget: HTMLFormElement };
	async function addVisit(event: SvelteSubmitEvent) {
		event.preventDefault();
		addingVisit = true;

		const form = new FormData(event.currentTarget);
		const date = new Date(form.get('date') as string);

		const stationRecord = await stationsDb.getOrCreate({
			name: station.name,
			osmId: station.osm_id,
			lat: station.latitude,
			lng: station.longitude,
		});

		const visit = await visitsDb.add({
			stationId: stationRecord.id,
			// todo save this with users tz offset preserved
			date: date.toISOString(),
		});

		console.log('Saved visit:', visit);

		addingVisit = false;
		visitModalOpen = false;
	}
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

		<Modal bind:open={visitModalOpen}>
			{#snippet activator()}
				<button class="icon">
					<IconAdd size={18} />
				</button>
			{/snippet}

			{#snippet children()}
				<h3>Record Visit to {station.name}</h3>

				<form class="record-visit" onsubmit={addVisit}>
					<label>
						<span class="sr-only">When</span>
						<input
							name="date"
							type="datetime-local"
							disabled={addingVisit}
							required />
					</label>

					<button disabled={addingVisit}>
						{addingVisit ? 'Saving...' : 'Save'}
					</button>
				</form>
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

	.record-visit {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 8px;

		label {
			flex-grow: 1;
		}
	}
</style>

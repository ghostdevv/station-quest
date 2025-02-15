<script lang="ts">
	import IconGripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import IconGripVertical from 'lucide-svelte/icons/grip-vertical';
	import { Pane, PaneGroup, PaneResizer } from 'paneforge';
	import { type Direction, ctx } from '$lib/state.svelte';
	import Panel from '$lib/panel/Panel.svelte';
	import Map from '$lib/map/Map.svelte';

	let isDragging = $state(false);
	let innerWidth = $state(0);

	let direction: Direction = $derived(
		innerWidth <= 830 ? 'vertical' : 'horizontal',
	);

	$effect(() => {
		ctx.direction = direction;
	});

	let panelMin = $derived(Math.ceil((284 / innerWidth) * 100));
	let collapsed = $state(false);
</script>

<svelte:window bind:innerWidth />

<PaneGroup {direction} class={direction == 'vertical' ? 'pane-reverse' : ''}>
	<Pane
		defaultSize={direction == 'horizontal' ? panelMin : 33}
		minSize={direction == 'horizontal' ? panelMin : 33}
		order={direction == 'horizontal' ? 1 : 2}
		onCollapse={() => (collapsed = true)}
		onExpand={() => (collapsed = false)}
		collapsible>
		<Panel />
	</Pane>

	<PaneResizer
		class="resizer"
		onDraggingChange={(v: boolean) => {
			isDragging = v;
		}}>
		<div
			class="resizer-grip {direction}"
			class:active={isDragging}
			class:collapsed>
			{#if direction == 'horizontal'}
				<IconGripVertical size={18} />
			{:else}
				<IconGripHorizontal size={18} />
			{/if}
		</div>
	</PaneResizer>

	<Pane minSize={33} order={direction == 'horizontal' ? 2 : 1}>
		<Map />
	</Pane>
</PaneGroup>

<style>
	:global(.pane-reverse) {
		flex-direction: column-reverse !important;
	}

	:global(.resizer) {
		display: flex;
		align-items: center;
		justify-content: center;

		&:focus .resizer-grip {
			background-color: var(--primary);
		}
	}

	.resizer-grip {
		display: flex;
		align-items: center;
		justify-content: center;

		background-color: var(--background-tertiary);
		border-radius: 4px;
		z-index: 1000;

		transition: background-color 0.2s ease-in-out;

		&.horizontal {
			padding: 6px 2px;
			margin: 0px -4px;

			&.collapsed {
				margin-right: -11px;
				margin-left: 0px;
			}
		}

		&.vertical {
			padding: 2px 6px;
			margin: -4px 0px;

			&.collapsed {
				margin-top: -11px;
				margin-bottom: 0px;
			}
		}

		&:hover,
		&:active,
		&.active {
			background-color: var(--primary);
		}
	}
</style>

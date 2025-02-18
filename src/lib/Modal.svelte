<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		activator?: Snippet;
		children: Snippet<[open: () => void, close: () => void]>;
	}

	let { children, activator, open = $bindable(false) }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	function openModal() {
		open = true;
		dialog?.showModal();
	}

	function closeModal() {
		open = false;
		dialog?.close();
	}

	$effect(() => {
		if (open != dialog?.open) {
			if (open) {
				openModal();
			} else {
				closeModal();
			}
		}
	});

	// Based on code from https://stackoverflow.com/a/57463812
	function dialogClick(event: MouseEvent) {
		if (!dialog || event.target != dialog) return;

		const rect = dialog.getBoundingClientRect();

		const clickedInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;

		if (clickedInDialog === false) {
			closeModal();
		}
	}
</script>

{#if activator}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="activator" onclick={openModal}>
		{@render activator()}
	</div>
{/if}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog bind:this={dialog} onclick={dialogClick}>
	{#if open}
		{@render children(openModal, closeModal)}
	{/if}
</dialog>

<style>
	.activator {
		display: contents;
	}
</style>

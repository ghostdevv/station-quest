<script lang="ts">
	import Search from './Search.svelte';
</script>

<svelte:boundary>
	<Search />

	{#snippet failed(error, reset)}
		<p><small>{error}</small></p>
		<button class="icon" onclick={reset}>retry</button>
	{/snippet}
</svelte:boundary>

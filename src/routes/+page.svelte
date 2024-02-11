<script lang="ts">
	export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if data.user}
	<h1>Hello {data.user.email}</h1>
{/if}

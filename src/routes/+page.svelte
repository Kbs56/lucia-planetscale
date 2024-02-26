<script lang="ts">
	export let data;
</script>

<title>Home</title>

<div class="flex h-screen items-center justify-center">
	{#if data.user}
		<h1 class="text-2xl text-slate-800">Hello {data.user.email}</h1>
	{/if}
</div>

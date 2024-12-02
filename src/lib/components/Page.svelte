<script lang="ts">
	import { onMount } from 'svelte';
	import { loadGhostData } from '$lib/util';
	import { ghostDataList } from '$lib/store';
	import Search from './Search.svelte';

	let errors: Error[] = [];
	let dirs: string[] = [];
	let sakuraNames: string[] = [];
	let keroNames: string[] = [];

	onMount(async () => {
		loadGhostData().then((v) => {
			ghostDataList.set(v[0]);
			errors = v[1].slice();
			if ($ghostDataList) {
				dirs = $ghostDataList.map((v) => v.directory).sort();
				sakuraNames = $ghostDataList.map((v) => v.sakuraName).sort();
				keroNames = $ghostDataList.map((v) => v.keroName).sort();
			}
		});
	});
</script>

<svelte:head>
	<title>被り負けチェッカーTS</title>
</svelte:head>

<div id="container" class="container">
	<header>
		<h1>被り負けチェッカーTS</h1>
		<p>「伺か」のゴーストの情報が他と被っていないか調べます。</p>
	</header>
	<main>
		<section class="contents">
			{#if $ghostDataList === null}
				<span>Loading</span>
			{:else if $ghostDataList.length === 0 && errors.length !== 0}
				<span>Loading failed. Please Reload.</span>
			{:else}
				<Search kind="ディレクトリ" list={dirs} />
				<Search kind="sakuraName" list={sakuraNames} />
				<Search kind="keroName" list={keroNames} />
			{/if}
		</section>
		{#if errors.length !== 0}
			<section class="errors">
				<details>
					<summary>エラーがあります</summary>
					<ul>
						{#each errors as error, i (i)}
							<li>{error.message}</li>
						{/each}
					</ul>
				</details>
			</section>
		{/if}
	</main>
	<footer>
		<p>被り負けチェッカーTS v.0.1.1</p>
		<p><a href="https://github.com/tukinami/">作者のGitHub</a></p>
		<small>&copy; 月波 清火 & all contributors</small>
	</footer>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		margin: 0 auto;
		max-width: 900px;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
	}

	header {
		padding: 1rem 1rem;
	}

	main > section {
		padding: 0.5rem 1.5rem;
	}

	main > section:not(:last-child) {
		margin-bottom: 4rem;
	}

	footer {
		margin-top: auto;
		justify-self: end;
		padding: 1.5rem 1rem;
		text-align: right;
	}
</style>

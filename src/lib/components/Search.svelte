<script lang="ts">
	import { binarySearch } from '$lib/util';

	export let kind: string;
	export let list: string[];
	let value: string;
	let isExist: boolean | null = null;

	const handleOnInput = (ev: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const targetValue = ev.currentTarget?.value?.trim() ?? '';
		if (targetValue === '') {
			isExist = null;
		} else {
			isExist = binarySearch(list, targetValue);
		}
	};

	const handleOnClear = () => {
		value = '';
		isExist = null;
	};
</script>

<p class="search">
	<label class="search__label">
		<span class="labelBody">{kind}: </span>
		<span class="searchInputs">
			<input name="searchBox" type="text" bind:value placeholder={kind} on:input={handleOnInput} />
			<button on:click={handleOnClear}>消去</button>
		</span>
		{#if isExist === null}
			<span class="searchResult">(ここに結果が出ます)</span>
		{:else if isExist}
			<span class="searchResult isExist">!同じ{kind}を持つゴーストが存在しています!</span>
		{:else}
			<span class="searchResult isNotExist">同じ{kind}のゴーストは登録されていません</span>
		{/if}
	</label>
</p>

<style>
	.search:not(:last-child) {
		margin-bottom: 2.5rem;
	}

	.labelBody {
		display: inline-block;
		width: 8rem;
		margin: 0.4rem 0;
	}

	.searchInputs {
		display: inline-flex;
		flex-flow: row wrap;
		justify-content: flex-end;
	}

	.search input {
		height: 2rem;
		width: 15rem;
	}

	.search button {
		line-height: 2rem;
		padding: 0 0.8rem;
	}

	.searchResult {
		display: inline-block;
		max-width: 100%;
		min-width: min(25rem, 100%);
		margin: 0.4rem 0;
	}

	.searchResult.isExist {
		font-weight: bold;
		color: #a30029;
	}
</style>

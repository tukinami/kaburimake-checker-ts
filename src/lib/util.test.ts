import { vi, describe, it, expect, type SpyInstance, beforeEach, afterEach } from 'vitest';
import {
	uniqueGhostDataList,
	type GhostData,
	type GhostJSON,
	buildGhostDataBody,
	buildGhostData,
	fetchGhostData,
	binarySearch
} from './util';
import { ghostDataJsonList } from './data';

describe('fetchGhostData', () => {
	const caseDate = new Date().toJSON();

	describe('valid Data', () => {
		let mockedFetch: SpyInstance;

		beforeEach(async () => {
			mockedFetch = vi.spyOn(global, 'fetch').mockImplementation(async () => {
				return new Response(
					`{"update": "${caseDate}",
"ghostList": [{ "directory": "a", "sakuraName": "a", "keroName": "a" }]
}`,
					{ status: 200 }
				);
			});
		});
		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('valid data', async () => {
			const expectElement: GhostJSON = {
				update: caseDate,
				ghostList: [{ directory: 'a', sakuraName: 'a', keroName: 'a' }]
			};
			const expectLength = ghostDataJsonList.length;
			const expectRaw: GhostJSON[] = new Array(expectLength).fill(expectElement);
			const expect1 = await Promise.allSettled(
				expectRaw.map((v) => {
					return Promise.resolve(v);
				})
			);
			expect(await fetchGhostData('./test/path/')).toStrictEqual(expect1);
		});
	});

	describe('invalid Data', () => {
		let mockedFetch: SpyInstance;

		beforeEach(async () => {
			mockedFetch = vi.spyOn(global, 'fetch').mockImplementation(async () => {
				return new Response(
					`{"update": "${caseDate}",
"ghostList": [{ "directory": "a", "sakuraName": "a", "keroName": "a" }]
}`,
					{ status: 404 }
				);
			});
		});
		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('invalid data', async () => {
			const expectRaw: Promise<any>[] = ghostDataJsonList.map((filename) => {
				return Promise.reject(new Error(`${filename} HTTP error: Status: 404`));
			});
			const expect1 = await Promise.allSettled(expectRaw);

			expect(await fetchGhostData('./test/path/')).toStrictEqual(expect1);
		});
	});
});

describe('buildGhostData', () => {
	it('valid whole data', async () => {
		const case1 = await Promise.allSettled([
			new Promise((resolve, _reject) => {
				resolve({
					update: new Date().toJSON(),
					ghostList: [{ directory: 'a', sakuraName: 'a', keroName: 'a' }]
				});
			}),
			new Promise((resolve, _reject) => {
				resolve({
					update: new Date().toJSON(),
					ghostList: [{ directory: 'b', sakuraName: 'b', keroName: 'b' }]
				});
			}),
			new Promise((resolve, _reject) => {
				resolve({
					update: new Date().toJSON(),
					ghostList: [{ directory: 'c', sakuraName: 'c', keroName: 'c' }]
				});
			})
		]);

		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: 'c', sakuraName: 'c', keroName: 'c' }
		];

		expect(await buildGhostData(case1)).toStrictEqual([expect1, []]);
	});

	it('invalid data 01', async () => {
		const case1 = await Promise.allSettled([
			new Promise((resolve, _reject) => {
				resolve({
					update: new Date().toJSON(),
					ghostList: [{ directory: 'a', sakuraName: 'a', keroName: 'a' }]
				});
			}),
			new Promise((resolve, _reject) => {
				resolve({
					update: new Date().toJSON(),
					ghostList: [{ directory: 'b', sakuraName: 'b', keroName: 'b' }]
				});
			}),
			new Promise((_resolve, reject) => {
				reject(new Error('buildGhostData test Error'));
			})
		]);

		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		const expect2 = [new Error('buildGhostData test Error')];

		expect(await buildGhostData(case1)).toStrictEqual([expect1, expect2]);
	});

	it('invalid data 02', async () => {
		const case1 = await Promise.allSettled([
			new Promise((_resolve, reject) => {
				reject(new Error('buildGhostData test Error'));
			}),
			new Promise((_resolve, reject) => {
				reject(new Error('buildGhostData test Error'));
			}),
			new Promise((_resolve, reject) => {
				reject(new Error('buildGhostData test Error'));
			})
		]);
		const expect1 = [
			new Error('buildGhostData test Error'),
			new Error('buildGhostData test Error'),
			new Error('buildGhostData test Error')
		];

		expect(await buildGhostData(case1)).toStrictEqual([[], expect1]);
	});
});

describe('buildGhostDataBody', () => {
	it('valid data 01', () => {
		const case1: GhostJSON[] = [
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'a', sakuraName: 'a', keroName: 'a' }]
			},
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'b', sakuraName: 'b', keroName: 'b' }]
			},
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'c', sakuraName: 'c', keroName: 'c' }]
			}
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: 'c', sakuraName: 'c', keroName: 'c' }
		];
		expect(buildGhostDataBody(case1)).toStrictEqual(expect1);
	});

	it('invalid data 01', () => {
		const case1 = [
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'a', sakuraName: 'a', keroName: 'a' }]
			},
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'b', sakuraName: 'b', keroName: 'b' }]
			},
			{
				update: new Date().toJSON(),
				ghostList: undefined
			}
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		expect(buildGhostDataBody(case1)).toStrictEqual(expect1);
	});

	it('invalid element 01', () => {
		const case1 = [
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'a', sakuraName: 'a', keroName: 'a' }]
			},
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: 'b', sakuraName: 'b', keroName: 'b' }]
			},
			{
				update: new Date().toJSON(),
				ghostList: [{ directory: undefined, sakuraName: 'c', keroName: 'c' }]
			}
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		expect(buildGhostDataBody(case1)).toStrictEqual(expect1);
	});
});

describe('uniqueGhostDataList', () => {
	it('unique list and valid data', () => {
		const case1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: 'c', sakuraName: 'c', keroName: 'c' }
		];
		expect(uniqueGhostDataList(case1)).toStrictEqual(case1);
	});

	it('multiple item list and valid data', () => {
		const case1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		expect(uniqueGhostDataList(case1)).toStrictEqual(expect1);
	});

	it('invalid data 01', () => {
		const case1 = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: undefined, sakuraName: 'c', keroName: 'c' }
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		expect(uniqueGhostDataList(case1)).toStrictEqual(expect1);
	});

	it('invalid data 02', () => {
		const case1 = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: 'c', sakuraName: undefined, keroName: 'c' }
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		expect(uniqueGhostDataList(case1)).toStrictEqual(expect1);
	});

	it('invalid data 01', () => {
		const case1 = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' },
			{ directory: 'c', sakuraName: 'c', keroName: undefined }
		];
		const expect1: GhostData[] = [
			{ directory: 'a', sakuraName: 'a', keroName: 'a' },
			{ directory: 'b', sakuraName: 'b', keroName: 'b' }
		];
		expect(uniqueGhostDataList(case1)).toStrictEqual(expect1);
	});
});

describe('binarySearch', () => {
	it('unique value & odd array length', () => {
		const case1 = ['abc', 'def', 'ghi', 'jkl', 'mno'];
		expect(binarySearch(case1, 'abc')).toBeTruthy();
		expect(binarySearch(case1, 'def')).toBeTruthy();
		expect(binarySearch(case1, 'ghi')).toBeTruthy();
		expect(binarySearch(case1, 'jkl')).toBeTruthy();
		expect(binarySearch(case1, 'mno')).toBeTruthy();
		expect(binarySearch(case1, 'pqr')).toBeFalsy();
	});

	it('unique value & even array length', () => {
		const case1 = ['abc', 'def', 'ghi', 'jkl'];
		expect(binarySearch(case1, 'abc')).toBeTruthy();
		expect(binarySearch(case1, 'def')).toBeTruthy();
		expect(binarySearch(case1, 'ghi')).toBeTruthy();
		expect(binarySearch(case1, 'jkl')).toBeTruthy();
		expect(binarySearch(case1, 'pqr')).toBeFalsy();
	});

	it('unique value & odd array length', () => {
		const case1 = ['abc', 'abc', 'def', 'ghi', 'ghi'];
		expect(binarySearch(case1, 'abc')).toBeTruthy();
		expect(binarySearch(case1, 'def')).toBeTruthy();
		expect(binarySearch(case1, 'ghi')).toBeTruthy();
		expect(binarySearch(case1, 'pqr')).toBeFalsy();
	});

	it('unique value & even array length', () => {
		const case1 = ['abc', 'abc', 'def', 'def'];
		expect(binarySearch(case1, 'abc')).toBeTruthy();
		expect(binarySearch(case1, 'def')).toBeTruthy();
		expect(binarySearch(case1, 'pqr')).toBeFalsy();
	});
});

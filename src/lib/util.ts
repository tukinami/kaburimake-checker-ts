import { ghostDataJsonList } from './data';

export type GhostData = { directory: string; sakuraName: string; keroName: string };
export type GhostJSON = { update: string; ghostList: GhostData[] };

export const loadGhostData = async (): Promise<[GhostData[], Error[]]> => {
	return fetchGhostData('./data/ghostData/').then(buildGhostData);
};

export const fetchGhostData = async (path: string): Promise<PromiseSettledResult<any>[]> => {
	return Promise.allSettled(
		ghostDataJsonList.map(async (filename) => {
			return fetch(`${path}${filename}`).then((responce) => {
				if (!responce.ok) {
					throw new Error(`${filename} HTTP error: Status: ${responce.status}`);
				}
				return responce.json();
			});
		})
	);
};

export const buildGhostData = async (
	responces: PromiseSettledResult<any>[]
): Promise<[GhostData[], Error[]]> => {
	const results: GhostJSON[] = responces.flatMap((v) =>
		v.status === 'fulfilled' ? [v.value] : []
	);
	const errors = responces.flatMap((v) => (v.status === 'rejected' ? [v.reason] : []));

	for (const err of errors) {
		if (err) {
			console.error(err);
		}
	}
	return [buildGhostDataBody(results), errors];
};

export const buildGhostDataBody = (ghostJsons: (GhostJSON | any)[]) => {
	return ghostJsons.reduce((accumlator: GhostData[], current) => {
		if (current.ghostList === undefined) {
			console.error(`There's invalid json data in './data/ghostData'.`);
			return accumlator;
		}
		return uniqueGhostDataList([...accumlator, ...current.ghostList]);
	}, []);
};

export const uniqueGhostDataList = (array: (GhostData | any)[]): GhostData[] => {
	return array.reduce((accumulator: GhostData[], current) => {
		const isInvalid =
			typeof current.directory !== 'string' ||
			typeof current.sakuraName !== 'string' ||
			typeof current.keroName !== 'string';
		const isEqual = accumulator.find((v) => {
			return (
				JSON.stringify(Object.entries(v).sort()) ===
				JSON.stringify(Object.entries(current).sort())
			);
		});

		if (isInvalid) {
			console.error(`There's invalid json data element in './data/ghostData'.`);
		}

		return isEqual || isInvalid ? accumulator : [...accumulator, current];
	}, []);
};

export const binarySearch = <T>(array: T[], target: T): boolean => {
	let start = 0;
	let end = array.length - 1;

	while (start <= end) {
		const mid = Math.floor((start + end) / 2);

		if (array[mid] === target) {
			return true;
		}
		if (array[mid] < target) {
			start = mid + 1;
		} else {
			end = mid - 1;
		}
	}
	return false;
};

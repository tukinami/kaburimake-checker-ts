import { writable, type Writable } from 'svelte/store';
import { type GhostData } from './util';

export const ghostDataList: Writable<GhostData[] | null> = writable(null);

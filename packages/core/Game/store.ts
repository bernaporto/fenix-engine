import { createStore } from '@fenix-engine/utilities/store';

type GameStore = Record<string, any>;

export const store = createStore<GameStore>({});

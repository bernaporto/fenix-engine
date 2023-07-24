import { createStore } from '@fenix-engine/shared/store';

type GameStore = Record<string, any>;

export const store = createStore<GameStore>({});

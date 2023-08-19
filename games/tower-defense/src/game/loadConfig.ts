import { store } from '@/store';
import { GameplayConfig } from '@/types';
import { Loader } from '@fenix-engine/core/Loader';

export const loadConfig = async () => {
  const [enemies, towers] = await Promise.all([
    await Loader.loadJSON<GameplayConfig['enemies']>(
      'assets/config/enemies.json'
    ),
    await Loader.loadJSON<GameplayConfig['towers']>(
      'assets/config/towers.json'
    ),
  ]);

  store.set('config', {
    enemies,
    towers,
  });
};

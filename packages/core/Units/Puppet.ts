import type { AnimationAction, AnimationClip, Group } from 'three';
import { AnimationMixer } from 'three';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { PuppetAssetRegistry, UnitRegistry } from '../Game/registries';
import type { SkinnedObject, SkinnedUnitConfig } from '../@types';
import { TickerState } from '../Tools/Ticker';
import { applyMeshConfig } from './utils';
import { Unit } from './Unit';

/**
 * A Puppet is a unit with a skinned mesh child that is animated by a skeleton
 */
class Puppet extends Unit {
  public readonly puppeteer: Puppeteer;

  constructor({ path, defaultClip, ...meshUnitConfig }: SkinnedUnitConfig) {
    super({
      type: 'puppet',
      ...meshUnitConfig,
    });

    this.puppeteer = makePuppeteer(this, defaultClip);

    const assetPromise =
      PuppetAssetRegistry.get(path) ?? PuppetAssetRegistry.add(path, path);

    assetPromise.then(cloneSkinnedObject).then(({ animations, root }) => {
      applyMeshConfig(root, meshUnitConfig);

      this.node.add(root);
      this._emitEvent('load', animations);
    });
  }

  public override update(state: TickerState) {
    super.update(state);

    this.puppeteer.update(state.deltaTime);
  }
}

UnitRegistry.add('puppet', Puppet);
export { Puppet };

/* UTILS */
type Puppeteer = {
  actions: string[];
  currentAction: string | null;
  crossPlay: (name: string, duration?: number) => Promise<void>;
  /**
   * @deprecated
   * use `crossPlay` or `playOne` instead
   */
  play: (name: string) => Promise<void>;
  setSpeed: (value: number) => void;
  setWeight: (name: string, value: number) => Promise<void>;
  update: (delta: number) => void;
};

const makePuppeteer = (puppet: Puppet, defaultClip?: string): Puppeteer => {
  const mixer = new AnimationMixer(puppet.node);
  const actions: Map<string, AnimationAction> = new Map();
  let currentAction: AnimationAction | null = null;

  const loadPromise = new Promise<void>((resolve) => {
    // This is a typescript hack. We know that animations will be sent by the emitter,
    // but they are not exposed to the outside world.
    // @ts-ignore
    puppet.events.on('load', (animations: AnimationClip[]) => {
      animations.forEach((animation) => {
        const action = mixer.clipAction(animation);
        actions.set(animation.name, action);
      });

      resolve();
    });
  });

  const getAction = (name: string) => {
    const action = actions.get(name);

    if (!action) {
      throw new Error(`No animation found with name: ${name}`);
    }

    return action;
  };

  const puppeteer: Puppeteer = {
    get actions() {
      return [...actions.keys()];
    },

    get currentAction() {
      if (!currentAction) return null;

      return currentAction.getClip().name;
    },

    crossPlay: async (name, duration = 0.25) => {
      await loadPromise;

      const action = getAction(name);
      action.reset().play();

      if (currentAction) {
        action.syncWith(currentAction);
        currentAction.crossFadeTo(action, duration, true);
      }

      currentAction = action;
    },

    play: async (name: string) => {
      await loadPromise;

      puppeteer.crossPlay(name);
    },

    setSpeed: (value: number) => {
      mixer.timeScale = value;
    },

    setWeight: async (name: string, value: number) => {
      await loadPromise;

      const action = getAction(name);
      action.setEffectiveWeight(value);
    },

    update: (delta: number) => {
      mixer.update(delta);
    },
  };

  if (defaultClip) puppeteer.play(defaultClip);

  return puppeteer;
};

/* UTILS */

const cloneSkinnedObject = ({
  animations,
  root,
}: SkinnedObject): SkinnedObject => ({
  animations,
  root: cloneSkeleton(root) as Group,
});

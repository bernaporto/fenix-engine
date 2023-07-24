import { AnimationAction, AnimationClip, AnimationMixer } from 'three';
import { SkinnedObject } from '../types';
import { applyMaterial } from './utils';
import { Material } from './Material';
import { Unit, UnitConfig } from './Unit';

export type PuppetConfig = UnitConfig & {
  assetPromise: Promise<SkinnedObject>;
  material?: Material;
};

/**
 * A Puppet is a unit with a skinned mesh child that is animated by a skeleton
 */
export class Puppet extends Unit {
  public readonly puppeteer = makePuppeteer(this);

  constructor({ assetPromise, material, ...unitConfig }: PuppetConfig) {
    super(unitConfig);

    assetPromise.then(({ animations, root }) => {
      material && applyMaterial(root, material.build());
      this.node.add(root);
      this.emit('load', animations);
    });
  }
}

type Puppeteer = {
  actions: string[];
  currentAction: string | null;
  play: (name: string) => Promise<void>;
  update: (delta: number) => void;
};

const makePuppeteer = (puppet: Puppet): Puppeteer => {
  const mixer = new AnimationMixer(puppet.node);
  const actions: Map<string, AnimationAction> = new Map();
  let currentAction: AnimationAction | null = null;

  const loadPromise = new Promise<void>((resolve) => {
    // This is a typescript hack. We know that animations will be sent by the emitter,
    // but they are not exposed to the outside world.
    // @ts-ignore
    puppet.on('load', (animations: AnimationClip[]) => {
      animations.forEach((animation) => {
        const action = mixer.clipAction(animation);
        actions.set(animation.name, action);
      });

      resolve();
    });
  });

  return {
    get actions() {
      return [...actions.keys()];
    },

    get currentAction() {
      if (!currentAction) return null;

      return currentAction.getClip().name;
    },

    play: async (key: string) => {
      await loadPromise;

      const action = actions.get(key);

      if (!action) {
        throw new Error(`No animation found with key: ${key}`);
      }

      if (currentAction) {
        // TODO: create fadeOut/fadeIn configuration
        currentAction.fadeOut(0.25);
        action.fadeIn(0.25);
      }

      currentAction = action;
      currentAction.play();
    },

    update: (delta: number) => {
      mixer.update(delta);
    },
  };
};

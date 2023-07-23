import { AnimationClip, Group } from 'three';

export type SkinnedObject = {
  animations: AnimationClip[];
  root: Group;
};

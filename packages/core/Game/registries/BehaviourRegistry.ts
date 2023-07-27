import type { Behaviour, BehaviourController } from '../../@types/behaviour';
import { makeRegistry } from './makeRegistry';

export type { BehaviourController };

export const BehaviourRegistry = makeRegistry<Behaviour>();

import { makeRegistry } from '@fenix-engine/utilities/misc';
import type { Behaviour, BehaviourController } from '../../@types/behaviour';

export type { BehaviourController };

export const BehaviourRegistry = makeRegistry<Behaviour>();

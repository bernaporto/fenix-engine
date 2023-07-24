import type { PropFactory, PuppetFactory } from '../../Units';
import { makeRegistry } from './makeRegistry';

export const FactoryRegistry = makeRegistry<PropFactory | PuppetFactory>();

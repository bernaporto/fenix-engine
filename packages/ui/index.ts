import { registerComponents } from './components';
import { UIRenderer } from './core';

registerComponents();
export const ui = new UIRenderer();

import { registerComponents } from './tools';
import { UIRenderer } from './core';
import { applyRootStyles } from './tools/style';

applyRootStyles();
registerComponents();
export const UI = new UIRenderer();

import type { UIUnit } from '../core';

export type AnyContext = Record<string, unknown>;

export type RenderUIConfig = {
  path: string;
  context?: AnyContext;
  container?: HTMLElement;
  beforeRender?: (unit: UIUnit) => void;
};

export type UIUnitConfig = {
  context: AnyContext;
  node: ChildNode;
};

export type UIContainerConfig = UIUnitConfig & {
  path: string;
};

export type AnyContext = Record<string, unknown>;

export type RenderUIConfig = {
  path: string;
  context?: AnyContext;
  container?: HTMLElement;
};

export type UIUnitConfig = {
  context: AnyContext;
  node: ChildNode;
};

export type UIContainerConfig = UIUnitConfig & {
  path: string;
};

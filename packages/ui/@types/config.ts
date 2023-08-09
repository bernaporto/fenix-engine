export type AnyContext = Record<string, unknown>;

export type RenderUIConfig = {
  path: string;
  context?: AnyContext;
};

export type UIUnitConfig = {
  node: ChildNode;
  context?: AnyContext;
};

export type UIContainerConfig = UIUnitConfig & {
  path: string;
};

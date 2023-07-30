export type AnyContext = Record<string, unknown>;

export type RenderUIConfig = {
  containerId: string;
  path: string;
};

export type UIContainerConfig = {
  element: HTMLElement;
  path: string;
  context?: AnyContext;
};

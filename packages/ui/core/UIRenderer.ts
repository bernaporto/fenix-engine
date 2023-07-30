import type { AnyContext, RenderUIConfig } from '../@types';
import { UIContainer } from './UIContainer';

export class UIRenderer {
  public render(
    { containerId, path }: RenderUIConfig,
    context?: AnyContext
  ): VoidFunction {
    const element = document.getElementById(containerId);

    if (!element) {
      throw new Error(`Element with id ${containerId} not found`);
    }

    const container = new UIContainer({
      element,
      path,
      context,
    });

    return () => {
      container.unmount();
    };
  }
}

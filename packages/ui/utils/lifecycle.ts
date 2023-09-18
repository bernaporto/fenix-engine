import { EventEmitter } from 'eventemitter3';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import { DATA_ID_ATTR } from '../constants';

enum EventType {
  ATTACH = 'attach',
  DETACH = 'detach',
}

const emitter = new EventEmitter();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      emitter.emit(EventType.ATTACH, node);
    });

    mutation.removedNodes.forEach((node) => {
      emitter.emit(EventType.DETACH, node);
    });
  });
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

type LifecycleHandlerConfig = {
  id: string;
  onAttach: VoidFunction;
  onDetach: VoidFunction;
};

export const setupLifecycleHandler = ({
  id,
  onAttach,
  onDetach,
}: LifecycleHandlerConfig): VoidFunction => {
  const getNodeId = (node: Node): string | null => {
    if (node instanceof HTMLElement) {
      return node.getAttribute(DATA_ID_ATTR);
    }

    if (node.parentElement) {
      return getNodeId(node.parentElement);
    }

    return null;
  };

  const attachHandler = (node: Node) => {
    if (getNodeId(node) === id) {
      onAttach?.();
    }
  };

  const detachHandler = (node: Node) => {
    if (getNodeId(node) === id) {
      onDetach?.();
    }
  };

  emitter.on(EventType.ATTACH, attachHandler);
  emitter.on(EventType.DETACH, detachHandler);

  return () => {
    emitter.off(EventType.ATTACH, attachHandler);
    emitter.off(EventType.DETACH, detachHandler);
  };
};

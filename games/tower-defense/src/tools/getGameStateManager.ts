import { store } from '@/store';
import { GameState } from '@/types';

type LoopState = GameState['loopState'];
type LoopStateManager = {
  onceDone: (...fns: VoidFunction[]) => void;
};

const noop = () => {};

export const getLoopStateManager = (
  supportedStates: LoopState[]
): LoopStateManager => {
  const listeners = new Set<VoidFunction>();
  let done = false;

  const checkDone = (state = store.get('loopState')) => {
    if (!done && !supportedStates.includes(state)) {
      done = true;
      listeners.forEach((fn) => fn());
      listeners.clear();

      return true;
    }

    return false;
  };

  if (checkDone()) {
    return { onceDone: noop };
  }

  listeners.add(store.subscribe('loopState', checkDone));

  return {
    onceDone: (...fns: VoidFunction[]) => {
      if (done || checkDone()) return;

      fns.forEach((fn) => listeners.add(fn));
    },
  };
};

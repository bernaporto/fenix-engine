import {
  makeObservable,
  toReadonly,
  type ReadonlyObservable,
} from '@fenix-engine/utilities/reactivity';

type LoopStatus = 'running' | 'paused';

export type TickerState = {
  elapsedTime: number;
  deltaTime: number;
  status: LoopStatus;
};

export type Ticker = {
  state: ReadonlyObservable<TickerState>;
  setStatus: (status: LoopStatus) => void;
};

const createTicker = (): Ticker => {
  const observable = makeObservable<TickerState>({
    elapsedTime: 0,
    deltaTime: 0,
    status: 'running',
  });

  let forceStop = false;
  window.addEventListener('blur', () => (forceStop = true));
  window.addEventListener('focus', () => (forceStop = false));

  let lastTime = performance.now();
  const tick = () => {
    const { elapsedTime, status } = observable.get();

    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    if (forceStop || status === 'paused') {
      requestAnimationFrame(tick);
      return;
    }

    observable.set({
      status,
      deltaTime,
      elapsedTime: elapsedTime + deltaTime,
    });

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  return {
    state: toReadonly(observable),
    setStatus: (status) => {
      const currState = observable.get();

      observable.set({
        ...currState,
        status,
      });
    },
  };
};

export const Ticker = createTicker();

import {
  observable,
  readable,
  type Readable,
} from '@fenix-engine/utilities/reactivity';

type LoopStatus = 'running' | 'paused';

export type TickerState = {
  elapsedTime: number;
  deltaTime: number;
  status: LoopStatus;
};

export type Ticker = {
  state: Readable<TickerState>;
  setStatus: (status: LoopStatus) => void;
};

const createTicker = (): Ticker => {
  const state = observable<TickerState>({
    elapsedTime: 0,
    deltaTime: 0,
    status: 'running',
  });

  let forceStop = false;
  window.addEventListener('blur', () => (forceStop = true));
  window.addEventListener('focus', () => (forceStop = false));

  let lastTime = performance.now();
  const tick = () => {
    const { elapsedTime, status } = state.get();

    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    if (forceStop || status === 'paused') {
      requestAnimationFrame(tick);
      return;
    }

    state.set({
      status,
      deltaTime,
      elapsedTime: elapsedTime + deltaTime,
    });

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  return {
    state: readable(state),
    setStatus: (status) => {
      const currState = state.get();

      state.set({
        ...currState,
        status,
      });
    },
  };
};

export const Ticker = createTicker();

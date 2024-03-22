import type { AnyState } from '../store/types';
import { observable } from '../reactivity';

export type TStateMachineState<T extends AnyState = AnyState> = {
  id: string;
  transitions: string[];
  payload?: Readonly<T>;
  onEnter?: (data: Readonly<T>) => void;
  onExit?: (data: Readonly<T>) => void;
};

export type TStateMachine = {
  dispose: VoidFunction;
  current: <T extends AnyState>() => TStateMachineState<T> | null;
  onChange: (observer: (state: string) => void) => VoidFunction;
  register: <T extends AnyState>(config: TStateMachineState<T>) => void;
  transition: (state: string) => void;
};

const create = (): TStateMachine => {
  const states = new Map<string, TStateMachineState>();
  const stateOb = observable<TStateMachineState | null>(null);

  return {
    current: <T extends AnyState>() => {
      return stateOb.get() as TStateMachineState<T> | null;
    },

    dispose: () => {
      stateOb.clearObservers();
    },

    onChange: (observer) => {
      return stateOb.subscribe((state) => {
        if (state) {
          observer(state.id);
        }
      });
    },

    register: (config) => {
      states.set(config.id, config as TStateMachineState);
    },

    transition: (state: string) => {
      const currentState = stateOb.get();
      if (currentState?.id === state) {
        return;
      }

      const nextState = states.get(state);

      if (!nextState) {
        throw new Error(`State ${state} not found`);
      }

      if (!currentState) {
        stateOb.set(nextState);
        nextState.onEnter?.(nextState.payload ?? {});
        return;
      }

      if (!currentState.transitions.includes(state)) {
        console.log(
          `Transition from ${currentState.id} to ${state} not allowed`
        );
        return;
      }

      stateOb.set(nextState);
      currentState.onExit?.(currentState.payload ?? {});
      nextState.onEnter?.(nextState.payload ?? {});
    },
  };
};

export const StateMachine = {
  create,
};

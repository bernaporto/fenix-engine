import {
  TKeyEvent,
  TKeyHandler,
  getKeyHandler,
  parseKeyBlob,
} from './utils/getKeyHandler';

type TKeyEventHandler = {
  on: (
    event: TKeyEvent,
    callback: (event: KeyboardEvent) => void
  ) => VoidFunction;
  once: (
    event: TKeyEvent,
    callback: (event: KeyboardEvent) => void
  ) => VoidFunction;
};

export class KeyboardHandler {
  private _keyHandlerMap = new Map<string, TKeyHandler>();

  constructor() {
    document.addEventListener('keydown', this._handleKeyDown);
    document.addEventListener('keyup', this._handleKeyUp);
  }

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) return;

    event.preventDefault();

    const key = getKey(event);
    const handler = this._keyHandlerMap.get(key);

    handler?.emitter.emit('keydown', event);
  };

  private _handleKeyUp = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) return;

    event.preventDefault();

    const key = getKey(event);
    const handler = this._keyHandlerMap.get(key);

    handler?.emitter.emit('keyup', event);
  };

  public destroy = (): void => {
    document.removeEventListener('keydown', this._handleKeyDown);
    document.removeEventListener('keyup', this._handleKeyUp);

    this._keyHandlerMap.forEach((handler) => {
      handler.emitter.clear();
    });
    this._keyHandlerMap.clear();
  };

  public watch = (key: string): TKeyEventHandler => {
    const { key: lcKey } = parseKeyBlob(key);
    const handler = this._keyHandlerMap.get(lcKey) ?? getKeyHandler(key);

    if (!this._keyHandlerMap.has(lcKey)) {
      this._keyHandlerMap.set(lcKey, handler);
    }

    return {
      on: handler.emitter.on,
      once: handler.emitter.once,
    };
  };

  public static isShiftPlusKey =
    (key: string) =>
    (event: KeyboardEvent): boolean =>
      event.shiftKey && getKey(event) === key;

  public static isMetaPlusKey =
    (key: string) =>
    (event: KeyboardEvent): boolean =>
      (event.ctrlKey || event.metaKey) && getKey(event) === key;

  public static isKey =
    (key: string) =>
    (event: KeyboardEvent): boolean =>
      getKey(event) === key && !KeyboardHandler.isMetaPlusKey(key)(event);
}

const getKey = (event: KeyboardEvent): string => {
  if (event.key === ' ') return 'space';

  return event.key.toLowerCase();
};

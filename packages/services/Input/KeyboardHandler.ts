import {
  getKeyHandler,
  KeyboardUtils,
  type TKeyEvent,
  type TKeyHandler,
} from './utils';

type TKeyEventHandler = {
  on: (
    event: TKeyEvent,
    callback: (event: KeyboardEvent) => void,
  ) => VoidFunction;
  once: (
    event: TKeyEvent,
    callback: (event: KeyboardEvent) => void,
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

    const key = KeyboardUtils.getKey(event);
    const handler = this._keyHandlerMap.get(key);

    if (!handler || !handler.validate(event)) return;
    event.preventDefault();

    handler.emitter.emit('keydown', event);
  };

  private _handleKeyUp = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) return;

    event.preventDefault();

    const key = KeyboardUtils.getKey(event);
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
    const { key: lcKey } = KeyboardUtils.parseKeyBlob(key);
    const handler = this._keyHandlerMap.get(lcKey) ?? getKeyHandler(key);

    if (!this._keyHandlerMap.has(lcKey)) {
      this._keyHandlerMap.set(lcKey, handler);
    }

    return {
      on: handler.emitter.on,
      once: handler.emitter.once,
    };
  };
}

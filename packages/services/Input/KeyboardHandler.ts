import type { VoidFunction } from '@fenix-engine/utilities/@types';

type KeyConfigMap = Record<
  string,
  (
    | {
        validate?: (event: KeyboardEvent) => boolean;
        execute: (event: KeyboardEvent) => void;
      }
    | {
        validate?: (event: KeyboardEvent) => boolean;
        onKeyDown: (event: KeyboardEvent) => void;
        onKeyUp?: (event: KeyboardEvent) => void;
      }
  )[]
>;

export class KeyboardHandler {
  public readonly destroy: VoidFunction;

  constructor(keyConfigMap: KeyConfigMap) {
    const onKeyDown = handleKeyDown(keyConfigMap);
    const onKeyUp = handleKeyUp(keyConfigMap);

    // Handle keyboard events
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    this.destroy = (): void => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }

  public static isMetaPlusKey =
    (key: string) =>
    (event: KeyboardEvent): boolean =>
      (event.ctrlKey || event.metaKey) && event.key === key;

  public static isKey =
    (key: string) =>
    (event: KeyboardEvent): boolean =>
      event.key === key && !KeyboardHandler.isMetaPlusKey(key)(event);
}

const handleKeyDown =
  (keyConfigMap: KeyConfigMap) =>
  (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.repeat || !(event.key in keyConfigMap)) return;

    const keyConfig = keyConfigMap[event.key];

    keyConfig.forEach((config) => {
      if (config.validate && !config.validate(event)) return;

      if ('execute' in config) {
        config.execute(event);
      }

      if ('onKeyDown' in config) {
        config.onKeyDown(event);
      }
    });
  };

const handleKeyUp =
  (keyConfigMap: KeyConfigMap) =>
  (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.repeat || !(event.key in keyConfigMap)) return;

    const keyConfig = keyConfigMap[event.key];

    keyConfig.forEach((config) => {
      if (!('onKeyUp' in config)) return;
      if (config.validate && !config.validate(event)) return;

      config.onKeyUp?.(event);
    });
  };

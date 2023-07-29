type KeyConfigMap = Record<
  string,
  {
    validate: (event: KeyboardEvent) => boolean;
    execute: (event: KeyboardEvent) => void;
  }[]
>;

export class KeyboardHandler {
  public readonly destroy: VoidFunction;

  constructor(keyConfigMap: KeyConfigMap) {
    const onKeyDown = handleKeyDown(keyConfigMap);

    // Handle keyboard events
    document.addEventListener('keydown', onKeyDown);

    this.destroy = (): void => {
      document.removeEventListener('keydown', onKeyDown);
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

    keyConfig.forEach(({ validate, execute }) => {
      validate(event) && execute(event);
    });
  };

import type { AssetUnitConfig } from '@fenix-engine/core/@types';

export type TThemeItem = {
  asset: string;
  config?: Omit<AssetUnitConfig, 'path'>;
};

export type TThemeRule = {
  id: string;
  add(...values: TThemeItem[]): string;
  get(): TThemeItem[];
};

export type TTheme = {
  rule(rule: string, modifiers?: string[]): TThemeRule;
  list(): string[];
};

import type { MaterialConfig } from '@fenix-engine/core/@types';
import type { Material } from '@fenix-engine/core/Units';

export type TThemeItem = {
  asset: string;
  material?: Material | MaterialConfig;
};

export type TThemeRule = {
  add(...values: TThemeItem[]): void;
  get(): TThemeItem[];
};

export type TTheme = {
  rule(rule: string, modifiers?: string[]): TThemeRule;
  list(): string[];
};

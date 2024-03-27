import type { Material } from '@fenix-engine/core/Units';
import type { MaterialConfig } from '@fenix-engine/core/@types';

export type TThemeItem = {
  asset: string;
  material?: Material | MaterialConfig;
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

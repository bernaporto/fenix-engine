export const isNullable = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

export const isNotNullable = <T>(value: T | null | undefined): value is T =>
  !isNullable(value);

export const isValidObject = (obj: unknown): obj is object =>
  typeof obj === 'object' && obj !== null;

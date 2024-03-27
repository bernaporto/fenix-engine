export type TDataMap = Record<string, unknown>;
export type TMetadata = Record<string, unknown>;

type TSymbol = {
  type: string;
  payload?: TDataMap;
};

type TApplyResult = {
  produces?: TSymbol[];
  metadata?: TMetadata;
};

export type TProductionRule<
  T extends TDataMap = TDataMap,
  U extends TDataMap = TDataMap
> = {
  type: string;
  apply: (settings: T, payload: U) => TApplyResult;
};

export type TProductionItem<T extends TMetadata = TMetadata> = {
  type: string;
  children?: TProductionItem[];
  metadata?: T;
};

type TGenerateOptions = {
  fromRule: string;
  settings?: TDataMap;
};

export type TGenerator = {
  generate: (options: TGenerateOptions) => TProductionItem;

  rules: {
    register: <T extends TDataMap>(rule: TProductionRule<T>) => void;
  };
};

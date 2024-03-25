export type TDataMap = Record<string, unknown>;
export type TMetadata = Record<string, unknown>;

type TSymbol = {
  type: string;
  count?: number;
};

type TApplyResult = {
  produces: TSymbol[];
  metadata?: TMetadata;
};

export type TProductionRule<T extends TDataMap = TDataMap> = {
  type: string;
} & (
  | {
      terminal?: false;
      apply: (settings: T) => TApplyResult;
    }
  | {
      terminal: true;
      apply: (settings: T) => Omit<TApplyResult, 'produces'>;
    }
);

export type TProductionItem = {
  type: string;
  children?: TProductionItem[];
  metadata?: TMetadata;
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

export type TValidationFn = (type: string, data: TDataMap) => boolean;

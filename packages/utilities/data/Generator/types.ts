export type TAnySettings = Record<string, unknown>;
export type TMetadata = Record<string, unknown>;

type TSymbol = {
  type: string;
  count?: number;
};

type TApplyResult = {
  produces: TSymbol[];
  metadata?: TMetadata;
};

export type TProductionRule<T extends TAnySettings = TAnySettings> = {
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
  settings?: TAnySettings;
};

export type TGenerator = {
  generate: (options: TGenerateOptions) => TProductionItem;

  rules: {
    register: <T extends TAnySettings>(rule: TProductionRule<T>) => void;
  };
};

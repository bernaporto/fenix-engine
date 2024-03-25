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

export type TProductionRule = TSymbol &
  (
    | {
        terminal?: false;
        apply: <T extends TAnySettings = TAnySettings>(
          settings: T
        ) => TApplyResult;
      }
    | {
        terminal: true;
        apply: <T extends TAnySettings = TAnySettings>(
          settings: T
        ) => Omit<TApplyResult, 'produces'>;
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
    register: (rule: TProductionRule) => void;
  };
};

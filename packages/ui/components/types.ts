export type AnchorPresetType =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'left-center'
  | 'center'
  | 'right-center';

export type SizeType = 'small' | 'medium' | 'large' | 'xl';
export type VariantType = 'default' | 'ghost' | 'rounded';

export type AnchorAttributes = {
  preset: AnchorPresetType;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type ButtonAttributes = {
  disabled: boolean;
  onClick: VoidFunction;
  size: SizeType;
  variant: VariantType;
};

export type IconAttributes = {
  path: string;
  size: SizeType;
};

export type TextAttributes = {
  size: SizeType;
};

export type StackAttributes = {
  spacing: number;
};

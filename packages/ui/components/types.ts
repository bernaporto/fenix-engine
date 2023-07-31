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
export type TextWeightType = 'light' | 'regular' | 'bold' | 'black';
export type VariantType = 'default' | 'ghost' | 'rounded';

export type AnchorAttributes = {
  preset: AnchorPresetType;
};

export type BoxAttributes = {
  bg: string;
};

export type ButtonAttributes = {
  disabled: boolean;
  onclick: VoidFunction;
  size: SizeType;
  variant: VariantType;
};

export type FlexAttributes = {
  direction: 'row' | 'column';
  align: 'start' | 'center' | 'end';
  justify: 'start' | 'center' | 'end';
  spacing: number;
};

export type IconAttributes = {
  path: string;
  size: SizeType;
};

export type TextAttributes = {
  size: SizeType;
  weight: TextWeightType;
};

export type StackAttributes = {
  spacing: number;
};

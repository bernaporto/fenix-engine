// ref: https://stackoverflow.com/a/67110803

export type NestedValueOf<Obj, Key extends string> = Obj extends object
  ? Key extends `${infer Parent}.${infer Leaf}`
    ? Parent extends keyof Obj
      ? NestedValueOf<Obj[Parent], Leaf>
      : never
    : Key extends keyof Obj
    ? Obj[Key]
    : never
  : never;

export type NestedPathOf<Obj> = Obj extends object
  ? keyof Obj extends never
    ? ''
    : {
        [K in keyof Obj]-?: K extends string
          ? `${K}` | `${K}.${NestedPathOf<Obj[K]>}`
          : never;
      }[keyof Obj]
  : '';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

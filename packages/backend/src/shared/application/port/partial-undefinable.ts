export type PartialUndefinable<T> = {
  [P in keyof T]?: T[P] | undefined;
};

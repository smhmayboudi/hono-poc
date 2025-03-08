export const objectPropertiesFilterUndefined = <
  T extends Record<string, unknown>,
>(
  obj: T,
): { [K in keyof T]: Exclude<T[K], undefined> } =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value)) as {
    [K in keyof T]: Exclude<T[K], undefined>;
  };

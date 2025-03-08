export const objectPropertiesPick = <T extends object, K extends keyof T>(
  obj: T,
  keys?: K[],
): Pick<T, K> => {
  if (!keys || keys.length === 0) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as K)),
  ) as Pick<T, K>;
};

export const objectPropertiesOmit = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  obj: T,
  keys?: K[],
): Omit<T, K> => {
  if (!keys || keys.length === 0) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
};
// export const objectPropertiesOmit = <T extends object, K extends keyof T>(
//   obj: T,
//   keys: K[],
// ): Omit<T, K> => {
//   const result = {} as Omit<T, K>;

//   for (const [key] of Object.entries(obj) as [
//     Extract<keyof T, string>,
//     T[keyof T],
//   ][]) {
//     if (!keys.includes(key as unknown as K)) {
//       (result as T)[key] = obj[key];
//     }
//   }

//   return result;
// };

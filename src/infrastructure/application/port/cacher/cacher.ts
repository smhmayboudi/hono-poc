export interface PortCacher {
  del(key: string): Promise<boolean>;
  key(
    data: unknown,
  ): Record<"userPOCViewReadDriven" | "userPOCViewReadIdDriven", string>;
  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F>;
}

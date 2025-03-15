export type CacherMap = {
  DrivenUserPOCViewReadId: { id: string };
};

export interface PortCacher {
  del(key: string): Promise<boolean>;
  key<K extends keyof CacherMap>(
    data: CacherMap[K],
  ): Record<keyof CacherMap, string>;
  set<K extends keyof CacherMap>(
    key: string,
    value: CacherMap[K],
  ): Promise<CacherMap[K]>;
  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F>;
}

export type CacherMap = {
  DrivenUserPOCViewReadId: { id: string };
};

export interface PortCacher<K extends keyof CacherMap = keyof CacherMap> {
  del(key: string): Promise<boolean>;
  key(data: CacherMap[K]): Record<keyof CacherMap, string>;
  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F>;
}

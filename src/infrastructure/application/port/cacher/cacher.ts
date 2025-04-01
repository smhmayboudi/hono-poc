import type {
  PortDrivenUserPOCViewReadIDRequest,
  PortDrivenUserPOCViewReadIDResponse,
} from "../../../../domain/user-poc-view/application/port/driven/user-poc-view-read-id.ts";

export type CacherMap = {
  DrivenUserPOCViewReadID: {
    Request: PortDrivenUserPOCViewReadIDRequest;
    Response: PortDrivenUserPOCViewReadIDResponse;
  };
  AuthSecondaryStorage: {
    Request: { key: string };
    Response: { value: string };
  };
};

export interface PortCacher {
  del(key: string): Promise<boolean>;
  get<K extends keyof CacherMap>(
    key: string,
  ): Promise<CacherMap[K]["Response"] | null>;
  key<K extends keyof CacherMap>(
    data: CacherMap[K]["Request"],
  ): Record<keyof CacherMap, string>;
  set<K extends keyof CacherMap>(
    key: string,
    value: CacherMap[K]["Response"],
    ttl?: number,
  ): Promise<CacherMap[K]["Response"]>;
  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F>;
}

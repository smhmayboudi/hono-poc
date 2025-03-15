import type {
  PortDrivenUserPOCViewReadIDRequest,
  PortDrivenUserPOCViewReadIDResponse,
} from "../../../../domain/user-poc-view/application/port/driven/user-poc-view-read-id.ts";

export type CacherMapRequest = {
  DrivenUserPOCViewReadID: PortDrivenUserPOCViewReadIDRequest;
};

export type CacherMapResponse = {
  DrivenUserPOCViewReadID: PortDrivenUserPOCViewReadIDResponse;
};

export interface PortCacher {
  del(key: string): Promise<boolean>;
  key<K extends keyof CacherMapRequest>(
    data: CacherMapRequest[K],
  ): Record<keyof CacherMapRequest, string>;
  set<K extends keyof CacherMapResponse>(
    key: string,
    value: CacherMapResponse[K],
  ): Promise<CacherMapResponse[K]>;
  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F>;
}

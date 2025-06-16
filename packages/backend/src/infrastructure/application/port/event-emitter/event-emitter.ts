import type {
  PortDrivingCSPCreateRequest,
  PortDrivingCSPCreateResponse,
} from "../../../../domain/csp/application/port/driving/csp-create.ts";
import type {
  PortDrivingCSPReadRequest,
  PortDrivingCSPReadResponse,
} from "../../../../domain/csp/application/port/driving/csp-read.ts";
import type {
  PortDrivingUserPOCCreateRequest,
  PortDrivingUserPOCCreateResponse,
} from "../../../../domain/user-poc/application/port/driving/user-poc-create.ts";
import type {
  PortDrivingUserPOCDeleteRequest,
  PortDrivingUserPOCDeleteResponse,
} from "../../../../domain/user-poc/application/port/driving/user-poc-delete.ts";
import type {
  PortDrivingUserPOCReadRequest,
  PortDrivingUserPOCReadResponse,
} from "../../../../domain/user-poc/application/port/driving/user-poc-read.ts";
import type {
  PortDrivingUserPOCReadIDRequest,
  PortDrivingUserPOCReadIDResponse,
} from "../../../../domain/user-poc/application/port/driving/user-poc-read-id.ts";
import type {
  PortDrivingUserPOCUpdateRequest,
  PortDrivingUserPOCUpdateResponse,
} from "../../../../domain/user-poc/application/port/driving/user-poc-update.ts";
import type {
  PortDrivingUserPOCInformationCreateRequest,
  PortDrivingUserPOCInformationCreateResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-create.ts";
import type {
  PortDrivingUserPOCInformationDeleteRequest,
  PortDrivingUserPOCInformationDeleteResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-delete.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserIDRequest,
  PortDrivingUserPOCInformationDeleteUserIDResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCInformationReadRequest,
  PortDrivingUserPOCInformationReadResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-read.ts";
import type {
  PortDrivingUserPOCInformationReadIDRequest,
  PortDrivingUserPOCInformationReadIDResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-read-id.ts";
import type {
  PortDrivingUserPOCInformationUpdateRequest,
  PortDrivingUserPOCInformationUpdateResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-update.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserIDRequest,
  PortDrivingUserPOCInformationUpdateUserIDResponse,
} from "../../../../domain/user-poc-information/application/port/driving/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCViewCreateRequest,
  PortDrivingUserPOCViewCreateResponse,
} from "../../../../domain/user-poc-view/application/port/driving/user-poc-view-create.ts";
import type {
  PortDrivingUserPOCViewDeleteRequest,
  PortDrivingUserPOCViewDeleteResponse,
} from "../../../../domain/user-poc-view/application/port/driving/user-poc-view-delete.ts";
import type {
  PortDrivingUserPOCViewReadRequest,
  PortDrivingUserPOCViewReadResponse,
} from "../../../../domain/user-poc-view/application/port/driving/user-poc-view-read.ts";
import type {
  PortDrivingUserPOCViewReadIDRequest,
  PortDrivingUserPOCViewReadIDResponse,
} from "../../../../domain/user-poc-view/application/port/driving/user-poc-view-read-id.ts";
import type {
  PortDrivingUserPOCViewSearchRequest,
  PortDrivingUserPOCViewSearchResponse,
} from "../../../../domain/user-poc-view/application/port/driving/user-poc-view-search.ts";
import type {
  PortDrivingUserPOCViewUpdateRequest,
  PortDrivingUserPOCViewUpdateResponse,
} from "../../../../domain/user-poc-view/application/port/driving/user-poc-view-update.ts";

export type EventEmitterMap = {
  CSPUseCaseCreate: {
    request: PortDrivingCSPCreateRequest;
    response: PortDrivingCSPCreateResponse;
  };
  CSPUseCaseRead: {
    request: PortDrivingCSPReadRequest;
    response: PortDrivingCSPReadResponse;
  };
  UserPOCInformationUseCaseCreate: {
    request: PortDrivingUserPOCInformationCreateRequest;
    response: PortDrivingUserPOCInformationCreateResponse;
  };
  UserPOCInformationUseCaseDelete: {
    request: PortDrivingUserPOCInformationDeleteRequest;
    response: PortDrivingUserPOCInformationDeleteResponse;
  };
  UserPOCInformationUseCaseDeleteUserID: {
    request: PortDrivingUserPOCInformationDeleteUserIDRequest;
    response: PortDrivingUserPOCInformationDeleteUserIDResponse;
  };
  UserPOCInformationUseCaseRead: {
    request: PortDrivingUserPOCInformationReadRequest;
    response: PortDrivingUserPOCInformationReadResponse;
  };
  UserPOCInformationUseCaseReadID: {
    request: PortDrivingUserPOCInformationReadIDRequest;
    response: PortDrivingUserPOCInformationReadIDResponse;
  };
  UserPOCInformationUseCaseUpdate: {
    request: PortDrivingUserPOCInformationUpdateRequest;
    response: PortDrivingUserPOCInformationUpdateResponse;
  };
  UserPOCInformationUseCaseUpdateUserID: {
    request: PortDrivingUserPOCInformationUpdateUserIDRequest;
    response: PortDrivingUserPOCInformationUpdateUserIDResponse;
  };
  UserPOCUseCaseCreate: {
    request: PortDrivingUserPOCCreateRequest;
    response: PortDrivingUserPOCCreateResponse;
  };
  UserPOCUseCaseDelete: {
    request: PortDrivingUserPOCDeleteRequest;
    response: PortDrivingUserPOCDeleteResponse;
  };
  UserPOCUseCaseRead: {
    request: PortDrivingUserPOCReadRequest;
    response: PortDrivingUserPOCReadResponse;
  };
  UserPOCUseCaseReadID: {
    request: PortDrivingUserPOCReadIDRequest;
    response: PortDrivingUserPOCReadIDResponse;
  };
  UserPOCUseCaseUpdate: {
    request: PortDrivingUserPOCUpdateRequest;
    response: PortDrivingUserPOCUpdateResponse;
  };
  UserPOCViewUseCaseCreate: {
    request: PortDrivingUserPOCViewCreateRequest;
    response: PortDrivingUserPOCViewCreateResponse;
  };
  UserPOCViewUseCaseDelete: {
    request: PortDrivingUserPOCViewDeleteRequest;
    response: PortDrivingUserPOCViewDeleteResponse;
  };
  UserPOCViewUseCaseRead: {
    request: PortDrivingUserPOCViewReadRequest;
    response: PortDrivingUserPOCViewReadResponse;
  };
  UserPOCViewUseCaseReadID: {
    request: PortDrivingUserPOCViewReadIDRequest;
    response: PortDrivingUserPOCViewReadIDResponse;
  };
  UserPOCViewUseCaseSearch: {
    request: PortDrivingUserPOCViewSearchRequest;
    response: PortDrivingUserPOCViewSearchResponse;
  };
  UserPOCViewUseCaseUpdate: {
    request: PortDrivingUserPOCViewUpdateRequest;
    response: PortDrivingUserPOCViewUpdateResponse;
  };
};

export interface PortEventEmitter {
  emit<K extends keyof EventEmitterMap>(
    event: K,
    data: EventEmitterMap[K],
  ): void;
  off<K extends keyof EventEmitterMap>(
    event: K,
    listener: (data: EventEmitterMap[K]) => void,
  ): void;
  on<K extends keyof EventEmitterMap>(
    event: K,
    listener: (data: EventEmitterMap[K]) => void,
  ): void;
}

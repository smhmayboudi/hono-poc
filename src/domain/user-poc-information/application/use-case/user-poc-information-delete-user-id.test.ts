import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationDeleteUserID,
  PortDrivenUserPOCInformationDeleteUserIDRequest,
} from "../port/driven/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserIDRequest,
  PortDrivingUserPOCInformationDeleteUserIDResponse,
} from "../port/driving/user-poc-information-delete-user-id.ts";
import { UseCaseUserPOCInformationDeleteUserID } from "./user-poc-information-delete-user-id.ts";

describe("UserPOCInformation UseCase DeleteUserID", () => {
  const deleteMocks = (
    drivingUserPOCInformationDeleteUserIDRequest: PortDrivingUserPOCInformationDeleteUserIDRequest,
  ) => {
    const drivenUserPOCInformationDeleteUserIDRequest: PortDrivenUserPOCInformationDeleteUserIDRequest =
      {
        ...drivingUserPOCInformationDeleteUserIDRequest,
      };
    const drivenUserPOCInformationDeleteUserID =
      mock<PortDrivenUserPOCInformationDeleteUserID>({
        deleteUserId: vi.fn(),
      });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationDeleteUserID,
      drivenUserPOCInformationDeleteUserIDRequest,
      eventEmitter,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationDeleteUserIDRequest: PortDrivingUserPOCInformationDeleteUserIDRequest =
      {
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationDeleteUserID,
      drivenUserPOCInformationDeleteUserIDRequest,
      eventEmitter,
      logger,
    } = await deleteMocks(drivingUserPOCInformationDeleteUserIDRequest);
    const useCaseUserPOCInformationDeleteUserID =
      new UseCaseUserPOCInformationDeleteUserID(
        config,
        drivenUserPOCInformationDeleteUserID,
        eventEmitter,
        logger,
      );
    const drivenUserPOCInformationDeleteUserIDSpy = vi.spyOn(
      drivenUserPOCInformationDeleteUserID,
      "deleteUserId",
    );

    const brandDeleteUserID =
      await useCaseUserPOCInformationDeleteUserID.execute(
        drivingUserPOCInformationDeleteUserIDRequest,
      );

    expect(drivenUserPOCInformationDeleteUserIDSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationDeleteUserIDRequest,
    );
    const drivingUserPOCInformationDeleteUserIDResponse: PortDrivingUserPOCInformationDeleteUserIDResponse =
      {
        userId: drivingUserPOCInformationDeleteUserIDRequest.userId,
      };
    expect(brandDeleteUserID).toStrictEqual(
      drivingUserPOCInformationDeleteUserIDResponse,
    );
  });
});

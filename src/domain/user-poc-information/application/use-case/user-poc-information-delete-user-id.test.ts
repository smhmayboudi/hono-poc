import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationDeleteUserId,
  PortDrivenUserPOCInformationDeleteUserIdRequest,
} from "../port/driven/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserIdRequest,
  PortDrivingUserPOCInformationDeleteUserIdResponse,
} from "../port/driving/user-poc-information-delete-user-id.ts";
import { UseCaseUserPOCInformationDeleteUserId } from "./user-poc-information-delete-user-id.ts";

describe("UserPOCInformation UseCase DeleteUserId", () => {
  const deleteMocks = (
    drivingUserPOCInformationDeleteUserIdRequest: PortDrivingUserPOCInformationDeleteUserIdRequest,
  ) => {
    const drivenUserPOCInformationDeleteUserIdRequest: PortDrivenUserPOCInformationDeleteUserIdRequest =
      {
        ...drivingUserPOCInformationDeleteUserIdRequest,
      };
    const drivenUserPOCInformationDeleteUserId =
      mock<PortDrivenUserPOCInformationDeleteUserId>({
        delete: vi.fn(),
      });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationDeleteUserId,
      drivenUserPOCInformationDeleteUserIdRequest,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationDeleteUserIdRequest: PortDrivingUserPOCInformationDeleteUserIdRequest =
      {
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationDeleteUserId,
      drivenUserPOCInformationDeleteUserIdRequest,
      logger,
    } = await deleteMocks(drivingUserPOCInformationDeleteUserIdRequest);
    const useCaseUserPOCInformationDeleteUserId =
      new UseCaseUserPOCInformationDeleteUserId(
        config,
        drivenUserPOCInformationDeleteUserId,
        logger,
      );
    const drivenUserPOCInformationDeleteUserIdSpy = vi.spyOn(
      drivenUserPOCInformationDeleteUserId,
      "delete",
    );

    const brandDeleteUserId =
      await useCaseUserPOCInformationDeleteUserId.execute(
        drivingUserPOCInformationDeleteUserIdRequest,
      );

    expect(drivenUserPOCInformationDeleteUserIdSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationDeleteUserIdRequest,
    );
    const drivingUserPOCInformationDeleteUserIdResponse: PortDrivingUserPOCInformationDeleteUserIdResponse =
      {
        userId: drivingUserPOCInformationDeleteUserIdRequest.userId,
      };
    expect(brandDeleteUserId).toStrictEqual(
      drivingUserPOCInformationDeleteUserIdResponse,
    );
  });
});

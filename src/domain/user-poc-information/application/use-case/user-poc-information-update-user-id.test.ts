import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationUpdateUserId,
  PortDrivenUserPOCInformationUpdateUserIdRequest,
} from "../port/driven/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserIdRequest,
  PortDrivingUserPOCInformationUpdateUserIdResponse,
} from "../port/driving/user-poc-information-update-user-id.ts";
import { UseCaseUserPOCInformationUpdateUserId } from "./user-poc-information-update-user-id.ts";

describe("UserPOCInformation UseCase UpdateUserId", () => {
  const updateMocks = (
    drivingUserPOCInformationUpdateUserIdRequest: PortDrivingUserPOCInformationUpdateUserIdRequest,
  ) => {
    const drivenUserPOCInformationUpdateUserIdRequest: PortDrivenUserPOCInformationUpdateUserIdRequest =
      {
        ...drivingUserPOCInformationUpdateUserIdRequest,
      };
    const drivenUserPOCInformationUpdateUserId =
      mock<PortDrivenUserPOCInformationUpdateUserId>({
        update: vi.fn(),
      });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationUpdateUserId,
      drivenUserPOCInformationUpdateUserIdRequest,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationUpdateUserIdRequest: PortDrivingUserPOCInformationUpdateUserIdRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationUpdateUserId,
      drivenUserPOCInformationUpdateUserIdRequest,
      logger,
    } = await updateMocks(drivingUserPOCInformationUpdateUserIdRequest);
    const useCaseUserPOCInformationUpdateUserId =
      new UseCaseUserPOCInformationUpdateUserId(
        config,
        drivenUserPOCInformationUpdateUserId,
        logger,
      );
    const drivenUserPOCInformationUpdateUserIdSpy = vi.spyOn(
      drivenUserPOCInformationUpdateUserId,
      "update",
    );

    const brandUpdateUserId =
      await useCaseUserPOCInformationUpdateUserId.execute(
        drivingUserPOCInformationUpdateUserIdRequest,
      );

    expect(drivenUserPOCInformationUpdateUserIdSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationUpdateUserIdRequest,
    );
    const drivingUserPOCInformationUpdateUserIdResponse: PortDrivingUserPOCInformationUpdateUserIdResponse =
      {
        userId: drivingUserPOCInformationUpdateUserIdRequest.userId,
      };
    expect(brandUpdateUserId).toStrictEqual(
      drivingUserPOCInformationUpdateUserIdResponse,
    );
  });
});

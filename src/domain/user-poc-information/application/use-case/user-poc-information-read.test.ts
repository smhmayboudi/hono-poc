import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationRead,
  PortDrivenUserPOCInformationReadRequest,
  PortDrivenUserPOCInformationReadResponse,
} from "../port/driven/user-poc-information-read.ts";
import type {
  PortDrivingUserPOCInformationReadRequest,
  PortDrivingUserPOCInformationReadResponse,
} from "../port/driving/user-poc-information-read.ts";
import { UseCaseUserPOCInformationRead } from "./user-poc-information-read.ts";

describe("UserPOCInformation UseCase Read", () => {
  const readMocks = (
    drivingUserPOCInformationReadRequest: PortDrivingUserPOCInformationReadRequest,
  ) => {
    const drivenUserPOCInformationReadRequest: PortDrivenUserPOCInformationReadRequest =
      {
        ...drivingUserPOCInformationReadRequest,
      };
    const drivenUserPOCInformationReadResponse: PortDrivenUserPOCInformationReadResponse =
      [
        {
          address: faker.location.streetAddress(),
          age: faker.number.int(),
          id: faker.string.nanoid(24),
          userId: faker.string.nanoid(24),
        },
      ];
    const drivenUserPOCInformationRead = mock<PortDrivenUserPOCInformationRead>(
      {
        read: vi.fn().mockResolvedValue(drivenUserPOCInformationReadResponse),
      },
    );

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationRead,
      drivenUserPOCInformationReadRequest,
      drivenUserPOCInformationReadResponse,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationReadRequest: PortDrivingUserPOCInformationReadRequest =
      {};
    const {
      config,
      drivenUserPOCInformationRead,
      drivenUserPOCInformationReadRequest,
      drivenUserPOCInformationReadResponse,
      logger,
    } = await readMocks(drivingUserPOCInformationReadRequest);
    const useCaseUserPOCInformationRead = new UseCaseUserPOCInformationRead(
      config,
      drivenUserPOCInformationRead,
      logger,
    );
    const drivenUserPOCInformationReadSpy = vi.spyOn(
      drivenUserPOCInformationRead,
      "read",
    );

    const userPOCRead = await useCaseUserPOCInformationRead.execute(
      drivingUserPOCInformationReadRequest,
    );

    expect(drivenUserPOCInformationReadSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationReadRequest,
    );
    const drivingUserPOCInformationReadResponse: PortDrivingUserPOCInformationReadResponse =
      drivenUserPOCInformationReadResponse;
    expect(userPOCRead).toStrictEqual(drivingUserPOCInformationReadResponse);
  });
});

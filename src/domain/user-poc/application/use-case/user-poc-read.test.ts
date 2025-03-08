import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCRead,
  PortDrivenUserPOCReadRequest,
  PortDrivenUserPOCReadResponse,
} from "../port/driven/user-poc-read.ts";
import type {
  PortDrivingUserPOCReadRequest,
  PortDrivingUserPOCReadResponse,
} from "../port/driving/user-poc-read.ts";
import { UseCaseUserPOCRead } from "./user-poc-read.ts";

describe("UserPOC UseCase Read", () => {
  const readMocks = (
    drivingUserPOCReadRequest: PortDrivingUserPOCReadRequest,
  ) => {
    const drivenUserPOCReadRequest: PortDrivenUserPOCReadRequest = {
      ...drivingUserPOCReadRequest,
    };
    const drivenUserPOCReadResponse: PortDrivenUserPOCReadResponse = [
      {
        fullname: faker.person.fullName(),
        id: faker.string.nanoid(24),
      },
    ];
    const drivenUserPOCRead = mock<PortDrivenUserPOCRead>({
      read: vi.fn().mockResolvedValue(drivenUserPOCReadResponse),
    });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCRead,
      drivenUserPOCReadRequest,
      drivenUserPOCReadResponse,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCReadRequest: PortDrivingUserPOCReadRequest = {};
    const {
      config,
      drivenUserPOCRead,
      drivenUserPOCReadRequest,
      drivenUserPOCReadResponse,
      logger,
    } = await readMocks(drivingUserPOCReadRequest);
    const useCaseUserPOCRead = new UseCaseUserPOCRead(
      config,
      drivenUserPOCRead,
      logger,
    );
    const drivenUserPOCReadSpy = vi.spyOn(drivenUserPOCRead, "read");

    const userPOCRead = await useCaseUserPOCRead.execute(
      drivingUserPOCReadRequest,
    );

    expect(drivenUserPOCReadSpy).toHaveBeenCalledWith(drivenUserPOCReadRequest);
    const drivingUserPOCReadResponse: PortDrivingUserPOCReadResponse =
      drivenUserPOCReadResponse;
    expect(userPOCRead).toStrictEqual(drivingUserPOCReadResponse);
  });
});

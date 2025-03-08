import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCReadID,
  PortDrivenUserPOCReadIDRequest,
  PortDrivenUserPOCReadIDResponse,
} from "../port/driven/user-poc-read-id.ts";
import type {
  PortDrivingUserPOCReadIDRequest,
  PortDrivingUserPOCReadIDResponse,
} from "../port/driving/user-poc-read-id.ts";
import { UseCaseUserPOCReadID } from "./user-poc-read-id.ts";

describe("UserPOC UseCase ReadID", () => {
  const readMocks = (
    drivingUserPOCReadIDRequest: PortDrivingUserPOCReadIDRequest,
  ) => {
    const drivenUserPOCReadIDRequest: PortDrivenUserPOCReadIDRequest = {
      ...drivingUserPOCReadIDRequest,
    };
    const drivenUserPOCReadIDResponse: PortDrivenUserPOCReadIDResponse = {
      fullname: faker.person.fullName(),
      id: drivingUserPOCReadIDRequest.id,
    };
    const drivenUserPOCReadID = mock<PortDrivenUserPOCReadID>({
      readID: vi.fn().mockResolvedValue(drivenUserPOCReadIDResponse),
    });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCReadID,
      drivenUserPOCReadIDRequest,
      drivenUserPOCReadIDResponse,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCReadIDRequest: PortDrivingUserPOCReadIDRequest = {
      id: faker.string.nanoid(24),
    };
    const {
      config,
      drivenUserPOCReadID,
      drivenUserPOCReadIDRequest,
      drivenUserPOCReadIDResponse,
      logger,
    } = await readMocks(drivingUserPOCReadIDRequest);
    const useCaseUserPOCReadID = new UseCaseUserPOCReadID(
      config,
      drivenUserPOCReadID,
      logger,
    );
    const drivenUserPOCReadIDSpy = vi.spyOn(drivenUserPOCReadID, "readID");

    const userPOCReadID = await useCaseUserPOCReadID.execute(
      drivingUserPOCReadIDRequest,
    );

    expect(drivenUserPOCReadIDSpy).toHaveBeenCalledWith(
      drivenUserPOCReadIDRequest,
    );
    const drivingUserPOCReadIDResponse: PortDrivingUserPOCReadIDResponse =
      drivenUserPOCReadIDResponse;
    expect(userPOCReadID).toStrictEqual(drivingUserPOCReadIDResponse);
  });
});

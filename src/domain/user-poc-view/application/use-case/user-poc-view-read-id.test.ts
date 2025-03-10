import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCViewReadID,
  PortDrivenUserPOCViewReadIDRequest,
  PortDrivenUserPOCViewReadIDResponse,
} from "../port/driven/user-poc-view-read-id.ts";
import type {
  PortDrivingUserPOCViewReadIDRequest,
  PortDrivingUserPOCViewReadIDResponse,
} from "../port/driving/user-poc-view-read-id.ts";
import { UseCaseUserPOCViewReadID } from "./user-poc-view-read-id.ts";

describe("UserPOCView UseCase ReadID", () => {
  const readMocks = (
    drivingUserPOCViewReadIDRequest: PortDrivingUserPOCViewReadIDRequest,
  ) => {
    const drivenUserPOCViewReadIDRequest: PortDrivenUserPOCViewReadIDRequest = {
      ...drivingUserPOCViewReadIDRequest,
    };
    const drivenUserPOCViewReadIDResponse: PortDrivenUserPOCViewReadIDResponse =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
        id: drivingUserPOCViewReadIDRequest.id,
      };
    const drivenUserPOCViewReadID = mock<PortDrivenUserPOCViewReadID>({
      readID: vi.fn().mockResolvedValue(drivenUserPOCViewReadIDResponse),
    });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCViewReadID,
      drivenUserPOCViewReadIDRequest,
      drivenUserPOCViewReadIDResponse,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCViewReadIDRequest: PortDrivingUserPOCViewReadIDRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCViewReadID,
      drivenUserPOCViewReadIDRequest,
      drivenUserPOCViewReadIDResponse,
      logger,
    } = await readMocks(drivingUserPOCViewReadIDRequest);
    const useCaseUserPOCViewReadID = new UseCaseUserPOCViewReadID(
      config,
      drivenUserPOCViewReadID,
      logger,
    );
    const drivenUserPOCViewReadIDSpy = vi.spyOn(
      drivenUserPOCViewReadID,
      "readID",
    );

    const userPOCReadID = await useCaseUserPOCViewReadID.execute(
      drivingUserPOCViewReadIDRequest,
    );

    expect(drivenUserPOCViewReadIDSpy).toHaveBeenCalledWith(
      drivenUserPOCViewReadIDRequest,
    );
    const drivingUserPOCViewReadIDResponse: PortDrivingUserPOCViewReadIDResponse =
      drivenUserPOCViewReadIDResponse;
    expect(userPOCReadID).toStrictEqual(drivingUserPOCViewReadIDResponse);
  });
});

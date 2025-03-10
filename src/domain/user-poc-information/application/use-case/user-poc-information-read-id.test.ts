import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationReadID,
  PortDrivenUserPOCInformationReadIDRequest,
  PortDrivenUserPOCInformationReadIDResponse,
} from "../port/driven/user-poc-information-read-id.ts";
import type {
  PortDrivingUserPOCInformationReadIDRequest,
  PortDrivingUserPOCInformationReadIDResponse,
} from "../port/driving/user-poc-information-read-id.ts";
import { UseCaseUserPOCInformationReadID } from "./user-poc-information-read-id.ts";

describe("UserPOCInformation UseCase ReadID", () => {
  const readMocks = (
    drivingUserPOCInformationReadIDRequest: PortDrivingUserPOCInformationReadIDRequest,
  ) => {
    const drivenUserPOCInformationReadIDRequest: PortDrivenUserPOCInformationReadIDRequest =
      {
        ...drivingUserPOCInformationReadIDRequest,
      };
    const drivenUserPOCInformationReadIDResponse: PortDrivenUserPOCInformationReadIDResponse =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        id: drivingUserPOCInformationReadIDRequest.id,
        userId: faker.string.nanoid(24),
      };
    const drivenUserPOCInformationReadID =
      mock<PortDrivenUserPOCInformationReadID>({
        read: vi.fn().mockResolvedValue(drivenUserPOCInformationReadIDResponse),
      });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationReadID,
      drivenUserPOCInformationReadIDRequest,
      drivenUserPOCInformationReadIDResponse,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationReadIDRequest: PortDrivingUserPOCInformationReadIDRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationReadID,
      drivenUserPOCInformationReadIDRequest,
      drivenUserPOCInformationReadIDResponse,
      logger,
    } = await readMocks(drivingUserPOCInformationReadIDRequest);
    const useCaseUserPOCInformationReadID = new UseCaseUserPOCInformationReadID(
      config,
      drivenUserPOCInformationReadID,
      logger,
    );
    const drivenUserPOCInformationReadIDSpy = vi.spyOn(
      drivenUserPOCInformationReadID,
      "read",
    );

    const userPOCReadID = await useCaseUserPOCInformationReadID.execute(
      drivingUserPOCInformationReadIDRequest,
    );

    expect(drivenUserPOCInformationReadIDSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationReadIDRequest,
    );
    const drivingUserPOCInformationReadIDResponse: PortDrivingUserPOCInformationReadIDResponse =
      drivenUserPOCInformationReadIDResponse;
    expect(userPOCReadID).toStrictEqual(
      drivingUserPOCInformationReadIDResponse,
    );
  });
});

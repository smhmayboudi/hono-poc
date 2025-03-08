import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationUpdate,
  PortDrivenUserPOCInformationUpdateRequest,
} from "../port/driven/user-poc-information-update.ts";
import type {
  PortDrivingUserPOCInformationUpdateRequest,
  PortDrivingUserPOCInformationUpdateResponse,
} from "../port/driving/user-poc-information-update.ts";
import { UseCaseUserPOCInformationUpdate } from "./user-poc-information-update.ts";

describe("UserPOCInformation UseCase Update", () => {
  const updateMocks = (
    drivingUserPOCInformationUpdateRequest: PortDrivingUserPOCInformationUpdateRequest,
  ) => {
    const drivenUserPOCInformationUpdateRequest: PortDrivenUserPOCInformationUpdateRequest =
      {
        ...drivingUserPOCInformationUpdateRequest,
      };
    const drivenUserPOCInformationUpdate =
      mock<PortDrivenUserPOCInformationUpdate>({
        update: vi.fn(),
      });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationUpdate,
      drivenUserPOCInformationUpdateRequest,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationUpdateRequest: PortDrivingUserPOCInformationUpdateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        id: faker.string.nanoid(24),
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationUpdate,
      drivenUserPOCInformationUpdateRequest,
      logger,
    } = await updateMocks(drivingUserPOCInformationUpdateRequest);
    const useCaseUserPOCInformationUpdate = new UseCaseUserPOCInformationUpdate(
      config,
      drivenUserPOCInformationUpdate,
      logger,
    );
    const drivenUserPOCInformationUpdateSpy = vi.spyOn(
      drivenUserPOCInformationUpdate,
      "update",
    );

    const brandUpdate = await useCaseUserPOCInformationUpdate.execute(
      drivingUserPOCInformationUpdateRequest,
    );

    expect(drivenUserPOCInformationUpdateSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationUpdateRequest,
    );
    const drivingUserPOCInformationUpdateResponse: PortDrivingUserPOCInformationUpdateResponse =
      {
        id: drivingUserPOCInformationUpdateRequest.id,
      };
    expect(brandUpdate).toStrictEqual(drivingUserPOCInformationUpdateResponse);
  });
});

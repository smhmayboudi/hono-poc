import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCUpdate,
  PortDrivenUserPOCUpdateRequest,
} from "../port/driven/user-poc-update.ts";
import type {
  PortDrivingUserPOCUpdateRequest,
  PortDrivingUserPOCUpdateResponse,
} from "../port/driving/user-poc-update.ts";
import { UseCaseUserPOCUpdate } from "./user-poc-update.ts";

describe("UserPOC UseCase Update", () => {
  const updateMocks = (
    drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest,
  ) => {
    const drivenUserPOCUpdateRequest: PortDrivenUserPOCUpdateRequest = {
      ...drivingUserPOCUpdateRequest,
    };
    const drivenUserPOCUpdate = mock<PortDrivenUserPOCUpdate>({
      update: vi.fn(),
    });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCUpdate,
      drivenUserPOCUpdateRequest,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest = {
      fullname: faker.person.fullName(),
      id: faker.string.nanoid(24),
    };
    const { config, drivenUserPOCUpdate, drivenUserPOCUpdateRequest, logger } =
      await updateMocks(drivingUserPOCUpdateRequest);
    const useCaseUserPOCUpdate = new UseCaseUserPOCUpdate(
      config,
      drivenUserPOCUpdate,
      logger,
    );
    const drivenUserPOCUpdateSpy = vi.spyOn(drivenUserPOCUpdate, "update");

    const brandUpdate = await useCaseUserPOCUpdate.execute(
      drivingUserPOCUpdateRequest,
    );

    expect(drivenUserPOCUpdateSpy).toHaveBeenCalledWith(
      drivenUserPOCUpdateRequest,
    );
    const drivingUserPOCUpdateResponse: PortDrivingUserPOCUpdateResponse = {
      id: drivingUserPOCUpdateRequest.id,
    };
    expect(brandUpdate).toStrictEqual(drivingUserPOCUpdateResponse);
  });
});

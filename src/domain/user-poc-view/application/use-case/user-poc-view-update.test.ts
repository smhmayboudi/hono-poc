import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivingUserPOCUpdate,
  PortDrivingUserPOCUpdateRequest,
} from "../../../user-poc/application/port/driving/user-poc-update.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserId,
  PortDrivingUserPOCInformationUpdateUserIdRequest,
} from "../../../user-poc-information/application/port/driving/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCViewUpdateRequest,
  PortDrivingUserPOCViewUpdateResponse,
} from "../port/driving/user-poc-view-update.ts";
import { UseCaseUserPOCViewUpdate } from "./user-poc-view-update.ts";

describe("UserPOCView UseCase Update", () => {
  const updateMocks = (
    drivingUserPOCViewUpdateRequest: PortDrivingUserPOCViewUpdateRequest,
  ) => {
    const drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest = {
      id: drivingUserPOCViewUpdateRequest.id,
    };
    const drivingUserPOCUpdate = mock<PortDrivingUserPOCUpdate>({
      execute: vi
        .fn()
        .mockReturnValue({ id: drivingUserPOCViewUpdateRequest.id }),
    });

    const drivingUserPOCInformationUpdateUserIdRequest: PortDrivingUserPOCInformationUpdateUserIdRequest =
      {
        userId: drivingUserPOCViewUpdateRequest.id,
      };
    const drivingUserPOCInformationUpdateUserId =
      mock<PortDrivingUserPOCInformationUpdateUserId>({
        execute: vi
          .fn()
          .mockReturnValue({ id: drivingUserPOCViewUpdateRequest.id }),
      });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivingUserPOCInformationUpdateUserId,
      drivingUserPOCInformationUpdateUserIdRequest,
      drivingUserPOCUpdate,
      drivingUserPOCUpdateRequest,
      eventEmitter,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(3);

    const drivingUserPOCViewUpdateRequest: PortDrivingUserPOCViewUpdateRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivingUserPOCInformationUpdateUserId,
      drivingUserPOCInformationUpdateUserIdRequest,
      drivingUserPOCUpdate,
      drivingUserPOCUpdateRequest,
      eventEmitter,
      logger,
    } = await updateMocks(drivingUserPOCViewUpdateRequest);
    const useCaseUserPOCViewUpdate = new UseCaseUserPOCViewUpdate(
      config,
      drivingUserPOCUpdate,
      drivingUserPOCInformationUpdateUserId,
      eventEmitter,
      logger,
    );
    const drivingUserPOCUpdateSpy = vi.spyOn(drivingUserPOCUpdate, "execute");
    const drivingUserPOCInformationUpdateUserIdSpy = vi.spyOn(
      drivingUserPOCInformationUpdateUserId,
      "execute",
    );

    const brandUpdate = await useCaseUserPOCViewUpdate.execute(
      drivingUserPOCViewUpdateRequest,
    );

    expect(drivingUserPOCUpdateSpy).toHaveBeenCalledWith(
      drivingUserPOCUpdateRequest,
    );
    expect(drivingUserPOCInformationUpdateUserIdSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationUpdateUserIdRequest,
    );
    const drivingUserPOCViewUpdateResponse: PortDrivingUserPOCViewUpdateResponse =
      {
        id: drivingUserPOCViewUpdateRequest.id,
      };
    expect(brandUpdate).toStrictEqual(drivingUserPOCViewUpdateResponse);
  });
});

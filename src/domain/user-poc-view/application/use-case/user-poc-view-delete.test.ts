import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivingUserPOCDelete,
  PortDrivingUserPOCDeleteRequest,
} from "../../../user-poc/application/port/driving/user-poc-delete.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserId,
  PortDrivingUserPOCInformationDeleteUserIdRequest,
} from "../../../user-poc-information/application/port/driving/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCViewDeleteRequest,
  PortDrivingUserPOCViewDeleteResponse,
} from "../port/driving/user-poc-view-delete.ts";
import { UseCaseUserPOCViewDelete } from "./user-poc-view-delete.ts";

describe("UserPOCView UseCase Delete", () => {
  const deleteMocks = (
    drivingUserPOCViewDeleteRequest: PortDrivingUserPOCViewDeleteRequest,
  ) => {
    const drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest = {
      id: drivingUserPOCViewDeleteRequest.id,
    };
    const drivingUserPOCDelete = mock<PortDrivingUserPOCDelete>({
      execute: vi
        .fn()
        .mockReturnValue({ id: drivingUserPOCViewDeleteRequest.id }),
    });

    const drivingUserPOCInformationDeleteUserIdRequest: PortDrivingUserPOCInformationDeleteUserIdRequest =
      {
        userId: drivingUserPOCViewDeleteRequest.id,
      };
    const drivingUserPOCInformationDeleteUserId =
      mock<PortDrivingUserPOCInformationDeleteUserId>({
        execute: vi
          .fn()
          .mockReturnValue({ id: drivingUserPOCViewDeleteRequest.id }),
      });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivingUserPOCDelete,
      drivingUserPOCDeleteRequest,
      drivingUserPOCInformationDeleteUserId,
      drivingUserPOCInformationDeleteUserIdRequest,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(3);

    const drivingUserPOCViewDeleteRequest: PortDrivingUserPOCViewDeleteRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivingUserPOCDelete,
      drivingUserPOCDeleteRequest,
      drivingUserPOCInformationDeleteUserId,
      drivingUserPOCInformationDeleteUserIdRequest,
      logger,
    } = await deleteMocks(drivingUserPOCViewDeleteRequest);
    const useCaseUserPOCViewDelete = new UseCaseUserPOCViewDelete(
      config,
      drivingUserPOCDelete,
      drivingUserPOCInformationDeleteUserId,
      logger,
    );
    const drivingUserPOCDeleteSpy = vi.spyOn(drivingUserPOCDelete, "execute");
    const drivingUserPOCInformationDeleteUserIdSpy = vi.spyOn(
      drivingUserPOCInformationDeleteUserId,
      "execute",
    );

    const brandDelete = await useCaseUserPOCViewDelete.execute(
      drivingUserPOCViewDeleteRequest,
    );

    expect(drivingUserPOCDeleteSpy).toHaveBeenCalledWith(
      drivingUserPOCDeleteRequest,
    );
    expect(drivingUserPOCInformationDeleteUserIdSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationDeleteUserIdRequest,
    );
    const drivingUserPOCViewDeleteResponse: PortDrivingUserPOCViewDeleteResponse =
      {
        id: drivingUserPOCViewDeleteRequest.id,
      };
    expect(brandDelete).toStrictEqual(drivingUserPOCViewDeleteResponse);
  });
});

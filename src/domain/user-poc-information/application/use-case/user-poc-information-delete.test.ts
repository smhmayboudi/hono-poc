import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationDelete,
  PortDrivenUserPOCInformationDeleteRequest,
} from "../port/driven/user-poc-information-delete.ts";
import type {
  PortDrivingUserPOCInformationDeleteRequest,
  PortDrivingUserPOCInformationDeleteResponse,
} from "../port/driving/user-poc-information-delete.ts";
import { UseCaseUserPOCInformationDelete } from "./user-poc-information-delete.ts";

describe("UserPOCInformation UseCase Delete", () => {
  const deleteMocks = (
    drivingUserPOCInformationDeleteRequest: PortDrivingUserPOCInformationDeleteRequest,
  ) => {
    const drivenUserPOCInformationDeleteRequest: PortDrivenUserPOCInformationDeleteRequest =
      {
        ...drivingUserPOCInformationDeleteRequest,
      };
    const drivenUserPOCInformationDelete =
      mock<PortDrivenUserPOCInformationDelete>({
        delete: vi.fn(),
      });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationDelete,
      drivenUserPOCInformationDeleteRequest,
      eventEmitter,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationDeleteRequest: PortDrivingUserPOCInformationDeleteRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationDelete,
      drivenUserPOCInformationDeleteRequest,
      eventEmitter,
      logger,
    } = await deleteMocks(drivingUserPOCInformationDeleteRequest);
    const useCaseUserPOCInformationDelete = new UseCaseUserPOCInformationDelete(
      config,
      drivenUserPOCInformationDelete,
      eventEmitter,
      logger,
    );
    const drivenUserPOCInformationDeleteSpy = vi.spyOn(
      drivenUserPOCInformationDelete,
      "delete",
    );

    const brandDelete = await useCaseUserPOCInformationDelete.execute(
      drivingUserPOCInformationDeleteRequest,
    );

    expect(drivenUserPOCInformationDeleteSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationDeleteRequest,
    );
    const drivingUserPOCInformationDeleteResponse: PortDrivingUserPOCInformationDeleteResponse =
      {
        id: drivingUserPOCInformationDeleteRequest.id,
      };
    expect(brandDelete).toStrictEqual(drivingUserPOCInformationDeleteResponse);
  });
});

import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCDelete,
  PortDrivenUserPOCDeleteRequest,
} from "../port/driven/user-poc-delete.ts";
import type {
  PortDrivingUserPOCDeleteRequest,
  PortDrivingUserPOCDeleteResponse,
} from "../port/driving/user-poc-delete.ts";
import { UseCaseUserPOCDelete } from "./user-poc-delete.ts";

describe("UserPOC UseCase Delete", () => {
  const deleteMocks = (
    drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest,
  ) => {
    const drivenUserPOCDeleteRequest: PortDrivenUserPOCDeleteRequest = {
      ...drivingUserPOCDeleteRequest,
    };
    const drivenUserPOCDelete = mock<PortDrivenUserPOCDelete>({
      delete: vi.fn(),
    });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCDelete,
      drivenUserPOCDeleteRequest,
      eventEmitter,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest = {
      id: faker.string.nanoid(24),
    };
    const {
      config,
      drivenUserPOCDelete,
      drivenUserPOCDeleteRequest,
      eventEmitter,
      logger,
    } = await deleteMocks(drivingUserPOCDeleteRequest);
    const useCaseUserPOCDelete = new UseCaseUserPOCDelete(
      config,
      drivenUserPOCDelete,
      eventEmitter,
      logger,
    );
    const drivenUserPOCDeleteSpy = vi.spyOn(drivenUserPOCDelete, "delete");

    const brandDelete = await useCaseUserPOCDelete.execute(
      drivingUserPOCDeleteRequest,
    );

    expect(drivenUserPOCDeleteSpy).toHaveBeenCalledWith(
      drivenUserPOCDeleteRequest,
    );
    const drivingUserPOCDeleteResponse: PortDrivingUserPOCDeleteResponse = {
      id: drivingUserPOCDeleteRequest.id,
    };
    expect(brandDelete).toStrictEqual(drivingUserPOCDeleteResponse);
  });
});

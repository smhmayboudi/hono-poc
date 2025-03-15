import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCViewRead,
  PortDrivenUserPOCViewReadRequest,
  PortDrivenUserPOCViewReadResponse,
} from "../port/driven/user-poc-view-read.ts";
import type {
  PortDrivingUserPOCViewReadRequest,
  PortDrivingUserPOCViewReadResponse,
} from "../port/driving/user-poc-view-read.ts";
import { UseCaseUserPOCViewRead } from "./user-poc-view-read.ts";

describe("UserPOCView UseCase Read", () => {
  const readMocks = (
    drivingUserPOCViewReadRequest: PortDrivingUserPOCViewReadRequest,
  ) => {
    const drivenUserPOCViewReadRequest: PortDrivenUserPOCViewReadRequest = {
      ...drivingUserPOCViewReadRequest,
    };
    const drivenUserPOCViewReadResponse: PortDrivenUserPOCViewReadResponse = [
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
        id: faker.string.nanoid(24),
      },
    ];
    const drivenUserPOCViewRead = mock<PortDrivenUserPOCViewRead>({
      read: vi.fn().mockResolvedValue(drivenUserPOCViewReadResponse),
    });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCViewRead,
      drivenUserPOCViewReadRequest,
      drivenUserPOCViewReadResponse,
      eventEmitter,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCViewReadRequest: PortDrivingUserPOCViewReadRequest = {};
    const {
      config,
      drivenUserPOCViewRead,
      drivenUserPOCViewReadRequest,
      drivenUserPOCViewReadResponse,
      eventEmitter,
      logger,
    } = await readMocks(drivingUserPOCViewReadRequest);
    const useCaseUserPOCViewRead = new UseCaseUserPOCViewRead(
      config,
      drivenUserPOCViewRead,
      eventEmitter,
      logger,
    );
    const drivenUserPOCViewReadSpy = vi.spyOn(drivenUserPOCViewRead, "read");

    const userPOCRead = await useCaseUserPOCViewRead.execute(
      drivingUserPOCViewReadRequest,
    );

    expect(drivenUserPOCViewReadSpy).toHaveBeenCalledWith(
      drivenUserPOCViewReadRequest,
    );
    const drivingUserPOCViewReadResponse: PortDrivingUserPOCViewReadResponse =
      drivenUserPOCViewReadResponse;
    expect(userPOCRead).toStrictEqual(drivingUserPOCViewReadResponse);
  });
});

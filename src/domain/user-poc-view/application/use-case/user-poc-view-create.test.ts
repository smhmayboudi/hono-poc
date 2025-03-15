import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivingUserPOCCreate,
  PortDrivingUserPOCCreateRequest,
} from "../../../user-poc/application/port/driving/user-poc-create.ts";
import type {
  PortDrivingUserPOCInformationCreate,
  PortDrivingUserPOCInformationCreateRequest,
} from "../../../user-poc-information/application/port/driving/user-poc-information-create.ts";
import type {
  PortDrivingUserPOCViewCreateRequest,
  PortDrivingUserPOCViewCreateResponse,
} from "../port/driving/user-poc-view-create.ts";
import { UseCaseUserPOCViewCreate } from "./user-poc-view-create.ts";

describe("UserPOCView UseCase Create", () => {
  const createMocks = (
    drivingUserPOCViewCreateRequest: PortDrivingUserPOCViewCreateRequest,
  ) => {
    const id = faker.string.nanoid(24);

    const drivingUserPOCCreateRequest: PortDrivingUserPOCCreateRequest = {
      fullname: drivingUserPOCViewCreateRequest.fullname,
    };
    const drivingUserPOCCreate = mock<PortDrivingUserPOCCreate>({
      execute: vi.fn().mockReturnValue({ id }),
    });

    const drivingUserPOCInformationCreateRequest: PortDrivingUserPOCInformationCreateRequest =
      {
        address: drivingUserPOCViewCreateRequest.address,
        age: drivingUserPOCViewCreateRequest.age,
        userId: id,
      };
    const drivingUserPOCInformationCreate =
      mock<PortDrivingUserPOCInformationCreate>({
        execute: vi.fn().mockReturnValue({ id: faker.string.nanoid(24) }),
      });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivingUserPOCCreate,
      drivingUserPOCCreateRequest,
      drivingUserPOCInformationCreate,
      drivingUserPOCInformationCreateRequest,
      eventEmitter,
      id,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(3);

    const drivingUserPOCViewCreateRequest: PortDrivingUserPOCViewCreateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
      };
    const {
      config,
      drivingUserPOCCreate,
      drivingUserPOCCreateRequest,
      drivingUserPOCInformationCreate,
      drivingUserPOCInformationCreateRequest,
      eventEmitter,
      id,
      logger,
    } = await createMocks(drivingUserPOCViewCreateRequest);
    const useCaseUserPOCViewCreate = new UseCaseUserPOCViewCreate(
      config,
      drivingUserPOCCreate,
      drivingUserPOCInformationCreate,
      eventEmitter,
      logger,
    );
    const drivingUserPOCCreateSpy = vi.spyOn(drivingUserPOCCreate, "execute");
    const drivingUserPOCInformationCreateSpy = vi.spyOn(
      drivingUserPOCInformationCreate,
      "execute",
    );

    const brandCreate = await useCaseUserPOCViewCreate.execute(
      drivingUserPOCViewCreateRequest,
    );

    expect(drivingUserPOCCreateSpy).toHaveBeenCalledWith(
      drivingUserPOCCreateRequest,
    );
    expect(drivingUserPOCInformationCreateSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationCreateRequest,
    );
    const drivingUserPOCViewCreateResponse: PortDrivingUserPOCViewCreateResponse =
      {
        id,
      };
    expect(brandCreate).toStrictEqual(drivingUserPOCViewCreateResponse);
  });
});

import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationCreate,
  PortDrivenUserPOCInformationCreateRequest,
} from "../port/driven/user-poc-information-create.ts";
import type {
  PortDrivingUserPOCInformationCreateRequest,
  PortDrivingUserPOCInformationCreateResponse,
} from "../port/driving/user-poc-information-create.ts";
import { UseCaseUserPOCInformationCreate } from "./user-poc-information-create.ts";

describe("UserPOCInformation UseCase Create", () => {
  const createMocks = (
    drivingUserPOCInformationCreateRequest: PortDrivingUserPOCInformationCreateRequest,
  ) => {
    const generate = mock<PortGenerate>({
      id: () => "1234567890",
    });

    const drivenUserPOCInformationCreateRequest: PortDrivenUserPOCInformationCreateRequest =
      {
        ...drivingUserPOCInformationCreateRequest,
        id: generate.id(),
      };
    const drivenUserPOCInformationCreate =
      mock<PortDrivenUserPOCInformationCreate>({
        create: vi.fn(),
      });

    const config = mock<PortConfig>();
    const eventEmitter = mock<PortEventEmitter>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCInformationCreate,
      drivenUserPOCInformationCreateRequest,
      eventEmitter,
      generate,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationCreateRequest: PortDrivingUserPOCInformationCreateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationCreate,
      drivenUserPOCInformationCreateRequest,
      eventEmitter,
      generate,
      logger,
    } = await createMocks(drivingUserPOCInformationCreateRequest);
    const useCaseUserPOCInformationCreate = new UseCaseUserPOCInformationCreate(
      config,
      drivenUserPOCInformationCreate,
      eventEmitter,
      generate,
      logger,
    );
    const drivenUserPOCInformationCreateSpy = vi.spyOn(
      drivenUserPOCInformationCreate,
      "create",
    );

    const brandCreate = await useCaseUserPOCInformationCreate.execute(
      drivingUserPOCInformationCreateRequest,
    );

    expect(drivenUserPOCInformationCreateSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationCreateRequest,
    );
    const drivingUserPOCInformationCreateResponse: PortDrivingUserPOCInformationCreateResponse =
      {
        id: generate.id(),
      };
    expect(brandCreate).toStrictEqual(drivingUserPOCInformationCreateResponse);
  });
});

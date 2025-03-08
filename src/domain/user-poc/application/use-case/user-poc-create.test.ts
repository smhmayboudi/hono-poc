import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCCreate,
  PortDrivenUserPOCCreateRequest,
} from "../port/driven/user-poc-create.ts";
import type {
  PortDrivingUserPOCCreateRequest,
  PortDrivingUserPOCCreateResponse,
} from "../port/driving/user-poc-create.ts";
import { UseCaseUserPOCCreate } from "./user-poc-create.ts";

describe("UserPOC UseCase Create", () => {
  const createMocks = (
    drivingUserPOCCreateRequest: PortDrivingUserPOCCreateRequest,
  ) => {
    const generate = mock<PortGenerate>({
      id: () => "1234567890",
    });

    const drivenUserPOCCreateRequest: PortDrivenUserPOCCreateRequest = {
      ...drivingUserPOCCreateRequest,
      id: generate.id(),
    };
    const drivenUserPOCCreate = mock<PortDrivenUserPOCCreate>({
      create: vi.fn(),
    });

    const config = mock<PortConfig>();
    const logger = mock<PortLogger>();

    return {
      config,
      drivenUserPOCCreate,
      drivenUserPOCCreateRequest,
      generate,
      logger,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCCreateRequest: PortDrivingUserPOCCreateRequest = {
      fullname: faker.person.fullName(),
    };
    const {
      config,
      drivenUserPOCCreate,
      drivenUserPOCCreateRequest,
      generate,
      logger,
    } = await createMocks(drivingUserPOCCreateRequest);
    const useCaseUserPOCCreate = new UseCaseUserPOCCreate(
      config,
      drivenUserPOCCreate,
      generate,
      logger,
    );
    const drivenUserPOCCreateSpy = vi.spyOn(drivenUserPOCCreate, "create");

    const brandCreate = await useCaseUserPOCCreate.execute(
      drivingUserPOCCreateRequest,
    );

    expect(drivenUserPOCCreateSpy).toHaveBeenCalledWith(
      drivenUserPOCCreateRequest,
    );
    const drivingUserPOCCreateResponse: PortDrivingUserPOCCreateResponse = {
      id: generate.id(),
    };
    expect(brandCreate).toStrictEqual(drivingUserPOCCreateResponse);
  });
});

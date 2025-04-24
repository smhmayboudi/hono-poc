import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
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
    const tracer = mock<PortTracer>();
    tracer.startActiveSpan.mockImplementation(
      <F extends (span?: Span) => unknown>(
        _name: string,
        _optionsOrFn: SpanOptions | F,
        _contextOrFn?: Context | F,
        fn?: F,
      ) => {
        const mockSpan = mock<Span>();
        const actualFn = (
          typeof _optionsOrFn === "function"
            ? _optionsOrFn
            : // eslint-disable-next-line sonarjs/no-nested-conditional
              typeof _contextOrFn === "function"
              ? _contextOrFn
              : fn
        ) as F;
        if (!actualFn) {
          throw new Error("No function provided to startActiveSpan");
        }
        const result = actualFn(mockSpan);
        if (result instanceof Promise) {
          return Promise.resolve(result);
        }

        return result;
      },
    );

    return {
      config,
      drivenUserPOCInformationCreate,
      drivenUserPOCInformationCreateRequest,
      eventEmitter,
      generate,
      logger,
      tracer,
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
      tracer,
    } = await createMocks(drivingUserPOCInformationCreateRequest);
    const useCaseUserPOCInformationCreate = new UseCaseUserPOCInformationCreate(
      config,
      drivenUserPOCInformationCreate,
      eventEmitter,
      generate,
      logger,
      tracer,
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

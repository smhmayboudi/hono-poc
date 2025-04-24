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
      drivenUserPOCCreate,
      drivenUserPOCCreateRequest,
      eventEmitter,
      generate,
      logger,
      tracer,
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
      eventEmitter,
      generate,
      logger,
      tracer,
    } = await createMocks(drivingUserPOCCreateRequest);
    const useCaseUserPOCCreate = new UseCaseUserPOCCreate(
      config,
      drivenUserPOCCreate,
      eventEmitter,
      generate,
      logger,
      tracer,
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

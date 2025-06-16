import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortTime } from "../../../../infrastructure/application/port/time/time.ts";
import type {
  PortDrivenCSPCreate,
  PortDrivenCSPCreateRequest,
} from "../port/driven/csp-create.ts";
import type {
  PortDrivingCSPCreateRequest,
  PortDrivingCSPCreateResponse,
} from "../port/driving/csp-create.ts";
import { UseCaseCSPCreate } from "./csp-create.ts";

describe("CSP UseCase Create", () => {
  const createMocks = (
    drivingCSPCreateRequest: PortDrivingCSPCreateRequest,
  ) => {
    const generate = mock<PortGenerate>({
      id: () => "1234567890",
    });
    const time = mock<PortTime>({
      now: () => new Date("2025/01/01"),
    });

    const drivenCSPCreateRequest: PortDrivenCSPCreateRequest = {
      ...drivingCSPCreateRequest,
      id: generate.id(),
      timestamp: time.now(),
    };
    const drivenCSPCreate = mock<PortDrivenCSPCreate>({
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
      drivenCSPCreate,
      drivenCSPCreateRequest,
      eventEmitter,
      generate,
      logger,
      time,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingCSPCreateRequest: PortDrivingCSPCreateRequest = {
      "csp-report": {
        "blocked-uri": faker.internet.url(),
        disposition: faker.internet.url(),
        "document-uri": faker.internet.url(),
        "effective-directive": faker.internet.url(),
        "original-policy": faker.internet.url(),
        "script-sample": faker.internet.url(),
        referrer: faker.internet.url(),
        "status-code": faker.number.int(),
        "violated-directive": faker.internet.url(),
      },
    };
    const {
      config,
      drivenCSPCreate,
      drivenCSPCreateRequest,
      eventEmitter,
      generate,
      logger,
      time,
      tracer,
    } = createMocks(drivingCSPCreateRequest);
    const useCaseCSPCreate = new UseCaseCSPCreate(
      config,
      drivenCSPCreate,
      eventEmitter,
      generate,
      logger,
      time,
      tracer,
    );
    const drivenCSPCreateSpy = vi.spyOn(drivenCSPCreate, "create");

    const brandCreate = await useCaseCSPCreate.execute(drivingCSPCreateRequest);

    expect(drivenCSPCreateSpy).toHaveBeenCalledWith(drivenCSPCreateRequest);
    const drivingCSPCreateResponse: PortDrivingCSPCreateResponse = {
      id: drivenCSPCreateRequest.id,
      timestamp: drivenCSPCreateRequest.timestamp,
    };
    expect(brandCreate).toStrictEqual(drivingCSPCreateResponse);
  });
});

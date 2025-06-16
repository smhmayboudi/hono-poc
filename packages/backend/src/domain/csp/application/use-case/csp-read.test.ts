import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenCSPRead,
  PortDrivenCSPReadRequest,
  PortDrivenCSPReadResponse,
} from "../port/driven/csp-read.ts";
import type {
  PortDrivingCSPReadRequest,
  PortDrivingCSPReadResponse,
} from "../port/driving/csp-read.ts";
import { UseCaseCSPRead } from "./csp-read.ts";

describe("CSP UseCase Read", () => {
  const readMocks = (drivingCSPReadRequest: PortDrivingCSPReadRequest) => {
    const drivenCSPReadRequest: PortDrivenCSPReadRequest = {
      ...drivingCSPReadRequest,
    };
    const drivenCSPReadResponse: PortDrivenCSPReadResponse = {
      data: [
        {
          timestamp: faker.date.past(),
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
          id: faker.string.nanoid(24),
        },
      ],
      pagination: { total: 1 },
    };
    const drivenCSPRead = mock<PortDrivenCSPRead>({
      read: vi.fn().mockResolvedValue(drivenCSPReadResponse),
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
      drivenCSPRead,
      drivenCSPReadRequest,
      drivenCSPReadResponse,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingCSPReadRequest: PortDrivingCSPReadRequest = {};
    const {
      config,
      drivenCSPRead,
      drivenCSPReadRequest,
      drivenCSPReadResponse,
      eventEmitter,
      logger,
      tracer,
    } = readMocks(drivingCSPReadRequest);
    const useCaseCSPRead = new UseCaseCSPRead(
      config,
      drivenCSPRead,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenCSPReadSpy = vi.spyOn(drivenCSPRead, "read");

    const cspRead = await useCaseCSPRead.execute(drivingCSPReadRequest);

    expect(drivenCSPReadSpy).toHaveBeenCalledWith(drivenCSPReadRequest);
    const drivingCSPReadResponse: PortDrivingCSPReadResponse =
      drivenCSPReadResponse;
    expect(cspRead).toStrictEqual(drivingCSPReadResponse);
  });
});

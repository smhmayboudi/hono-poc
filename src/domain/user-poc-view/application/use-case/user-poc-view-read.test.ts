import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
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
      drivenUserPOCViewRead,
      drivenUserPOCViewReadRequest,
      drivenUserPOCViewReadResponse,
      eventEmitter,
      logger,
      tracer,
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
      tracer,
    } = readMocks(drivingUserPOCViewReadRequest);
    const useCaseUserPOCViewRead = new UseCaseUserPOCViewRead(
      config,
      drivenUserPOCViewRead,
      eventEmitter,
      logger,
      tracer,
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

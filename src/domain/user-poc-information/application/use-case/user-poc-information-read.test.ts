import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCInformationRead,
  PortDrivenUserPOCInformationReadRequest,
  PortDrivenUserPOCInformationReadResponse,
} from "../port/driven/user-poc-information-read.ts";
import type {
  PortDrivingUserPOCInformationReadRequest,
  PortDrivingUserPOCInformationReadResponse,
} from "../port/driving/user-poc-information-read.ts";
import { UseCaseUserPOCInformationRead } from "./user-poc-information-read.ts";

describe("UserPOCInformation UseCase Read", () => {
  const readMocks = (
    drivingUserPOCInformationReadRequest: PortDrivingUserPOCInformationReadRequest,
  ) => {
    const drivenUserPOCInformationReadRequest: PortDrivenUserPOCInformationReadRequest =
      {
        ...drivingUserPOCInformationReadRequest,
      };
    const drivenUserPOCInformationReadResponse: PortDrivenUserPOCInformationReadResponse =
      [
        {
          address: faker.location.streetAddress(),
          age: faker.number.int(),
          id: faker.string.nanoid(24),
          userId: faker.string.nanoid(24),
        },
      ];
    const drivenUserPOCInformationRead = mock<PortDrivenUserPOCInformationRead>(
      {
        read: vi.fn().mockResolvedValue(drivenUserPOCInformationReadResponse),
      },
    );

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
      drivenUserPOCInformationRead,
      drivenUserPOCInformationReadRequest,
      drivenUserPOCInformationReadResponse,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationReadRequest: PortDrivingUserPOCInformationReadRequest =
      {};
    const {
      config,
      drivenUserPOCInformationRead,
      drivenUserPOCInformationReadRequest,
      drivenUserPOCInformationReadResponse,
      eventEmitter,
      logger,
      tracer,
    } = await readMocks(drivingUserPOCInformationReadRequest);
    const useCaseUserPOCInformationRead = new UseCaseUserPOCInformationRead(
      config,
      drivenUserPOCInformationRead,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCInformationReadSpy = vi.spyOn(
      drivenUserPOCInformationRead,
      "read",
    );

    const userPOCRead = await useCaseUserPOCInformationRead.execute(
      drivingUserPOCInformationReadRequest,
    );

    expect(drivenUserPOCInformationReadSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationReadRequest,
    );
    const drivingUserPOCInformationReadResponse: PortDrivingUserPOCInformationReadResponse =
      drivenUserPOCInformationReadResponse;
    expect(userPOCRead).toStrictEqual(drivingUserPOCInformationReadResponse);
  });
});

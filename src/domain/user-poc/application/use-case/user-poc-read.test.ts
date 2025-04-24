import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCRead,
  PortDrivenUserPOCReadRequest,
  PortDrivenUserPOCReadResponse,
} from "../port/driven/user-poc-read.ts";
import type {
  PortDrivingUserPOCReadRequest,
  PortDrivingUserPOCReadResponse,
} from "../port/driving/user-poc-read.ts";
import { UseCaseUserPOCRead } from "./user-poc-read.ts";

describe("UserPOC UseCase Read", () => {
  const readMocks = (
    drivingUserPOCReadRequest: PortDrivingUserPOCReadRequest,
  ) => {
    const drivenUserPOCReadRequest: PortDrivenUserPOCReadRequest = {
      ...drivingUserPOCReadRequest,
    };
    const drivenUserPOCReadResponse: PortDrivenUserPOCReadResponse = [
      {
        fullname: faker.person.fullName(),
        id: faker.string.nanoid(24),
      },
    ];
    const drivenUserPOCRead = mock<PortDrivenUserPOCRead>({
      read: vi.fn().mockResolvedValue(drivenUserPOCReadResponse),
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
      drivenUserPOCRead,
      drivenUserPOCReadRequest,
      drivenUserPOCReadResponse,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCReadRequest: PortDrivingUserPOCReadRequest = {};
    const {
      config,
      drivenUserPOCRead,
      drivenUserPOCReadRequest,
      drivenUserPOCReadResponse,
      eventEmitter,
      logger,
      tracer,
    } = await readMocks(drivingUserPOCReadRequest);
    const useCaseUserPOCRead = new UseCaseUserPOCRead(
      config,
      drivenUserPOCRead,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCReadSpy = vi.spyOn(drivenUserPOCRead, "read");

    const userPOCRead = await useCaseUserPOCRead.execute(
      drivingUserPOCReadRequest,
    );

    expect(drivenUserPOCReadSpy).toHaveBeenCalledWith(drivenUserPOCReadRequest);
    const drivingUserPOCReadResponse: PortDrivingUserPOCReadResponse =
      drivenUserPOCReadResponse;
    expect(userPOCRead).toStrictEqual(drivingUserPOCReadResponse);
  });
});

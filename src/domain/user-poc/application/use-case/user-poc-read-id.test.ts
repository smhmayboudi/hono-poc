import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCReadID,
  PortDrivenUserPOCReadIDRequest,
  PortDrivenUserPOCReadIDResponse,
} from "../port/driven/user-poc-read-id.ts";
import type {
  PortDrivingUserPOCReadIDRequest,
  PortDrivingUserPOCReadIDResponse,
} from "../port/driving/user-poc-read-id.ts";
import { UseCaseUserPOCReadID } from "./user-poc-read-id.ts";

describe("UserPOC UseCase ReadID", () => {
  const readMocks = (
    drivingUserPOCReadIDRequest: PortDrivingUserPOCReadIDRequest,
  ) => {
    const drivenUserPOCReadIDRequest: PortDrivenUserPOCReadIDRequest = {
      ...drivingUserPOCReadIDRequest,
    };
    const drivenUserPOCReadIDResponse: PortDrivenUserPOCReadIDResponse = {
      fullname: faker.person.fullName(),
      id: drivingUserPOCReadIDRequest.id,
    };
    const drivenUserPOCReadID = mock<PortDrivenUserPOCReadID>({
      readID: vi.fn().mockResolvedValue(drivenUserPOCReadIDResponse),
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
      drivenUserPOCReadID,
      drivenUserPOCReadIDRequest,
      drivenUserPOCReadIDResponse,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCReadIDRequest: PortDrivingUserPOCReadIDRequest = {
      id: faker.string.nanoid(24),
    };
    const {
      config,
      drivenUserPOCReadID,
      drivenUserPOCReadIDRequest,
      drivenUserPOCReadIDResponse,
      eventEmitter,
      logger,
      tracer,
    } = await readMocks(drivingUserPOCReadIDRequest);
    const useCaseUserPOCReadID = new UseCaseUserPOCReadID(
      config,
      drivenUserPOCReadID,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCReadIDSpy = vi.spyOn(drivenUserPOCReadID, "readID");

    const userPOCReadID = await useCaseUserPOCReadID.execute(
      drivingUserPOCReadIDRequest,
    );

    expect(drivenUserPOCReadIDSpy).toHaveBeenCalledWith(
      drivenUserPOCReadIDRequest,
    );
    const drivingUserPOCReadIDResponse: PortDrivingUserPOCReadIDResponse =
      drivenUserPOCReadIDResponse;
    expect(userPOCReadID).toStrictEqual(drivingUserPOCReadIDResponse);
  });
});

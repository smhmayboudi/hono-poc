import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCInformationReadID,
  PortDrivenUserPOCInformationReadIDRequest,
  PortDrivenUserPOCInformationReadIDResponse,
} from "../port/driven/user-poc-information-read-id.ts";
import type {
  PortDrivingUserPOCInformationReadIDRequest,
  PortDrivingUserPOCInformationReadIDResponse,
} from "../port/driving/user-poc-information-read-id.ts";
import { UseCaseUserPOCInformationReadID } from "./user-poc-information-read-id.ts";

describe("UserPOCInformation UseCase ReadID", () => {
  const readMocks = (
    drivingUserPOCInformationReadIDRequest: PortDrivingUserPOCInformationReadIDRequest,
  ) => {
    const drivenUserPOCInformationReadIDRequest: PortDrivenUserPOCInformationReadIDRequest =
      {
        ...drivingUserPOCInformationReadIDRequest,
      };
    const drivenUserPOCInformationReadIDResponse: PortDrivenUserPOCInformationReadIDResponse =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        id: drivingUserPOCInformationReadIDRequest.id,
        userId: faker.string.nanoid(24),
      };
    const drivenUserPOCInformationReadID =
      mock<PortDrivenUserPOCInformationReadID>({
        readID: vi
          .fn()
          .mockResolvedValue(drivenUserPOCInformationReadIDResponse),
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
      drivenUserPOCInformationReadID,
      drivenUserPOCInformationReadIDRequest,
      drivenUserPOCInformationReadIDResponse,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationReadIDRequest: PortDrivingUserPOCInformationReadIDRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationReadID,
      drivenUserPOCInformationReadIDRequest,
      drivenUserPOCInformationReadIDResponse,
      eventEmitter,
      logger,
      tracer,
    } = readMocks(drivingUserPOCInformationReadIDRequest);
    const useCaseUserPOCInformationReadID = new UseCaseUserPOCInformationReadID(
      config,
      drivenUserPOCInformationReadID,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCInformationReadIDSpy = vi.spyOn(
      drivenUserPOCInformationReadID,
      "readID",
    );

    const userPOCReadID = await useCaseUserPOCInformationReadID.execute(
      drivingUserPOCInformationReadIDRequest,
    );

    expect(drivenUserPOCInformationReadIDSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationReadIDRequest,
    );
    const drivingUserPOCInformationReadIDResponse: PortDrivingUserPOCInformationReadIDResponse =
      drivenUserPOCInformationReadIDResponse;
    expect(userPOCReadID).toStrictEqual(
      drivingUserPOCInformationReadIDResponse,
    );
  });
});

import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCInformationUpdateUserID,
  PortDrivenUserPOCInformationUpdateUserIDRequest,
} from "../port/driven/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserIDRequest,
  PortDrivingUserPOCInformationUpdateUserIDResponse,
} from "../port/driving/user-poc-information-update-user-id.ts";
import { UseCaseUserPOCInformationUpdateUserID } from "./user-poc-information-update-user-id.ts";

describe("UserPOCInformation UseCase UpdateUserID", () => {
  const updateMocks = (
    drivingUserPOCInformationUpdateUserIDRequest: PortDrivingUserPOCInformationUpdateUserIDRequest,
  ) => {
    const drivenUserPOCInformationUpdateUserIDRequest: PortDrivenUserPOCInformationUpdateUserIDRequest =
      {
        ...drivingUserPOCInformationUpdateUserIDRequest,
      };
    const drivenUserPOCInformationUpdateUserID =
      mock<PortDrivenUserPOCInformationUpdateUserID>({
        updateUserId: vi.fn(),
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
      drivenUserPOCInformationUpdateUserID,
      drivenUserPOCInformationUpdateUserIDRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationUpdateUserIDRequest: PortDrivingUserPOCInformationUpdateUserIDRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationUpdateUserID,
      drivenUserPOCInformationUpdateUserIDRequest,
      eventEmitter,
      logger,
      tracer,
    } = await updateMocks(drivingUserPOCInformationUpdateUserIDRequest);
    const useCaseUserPOCInformationUpdateUserID =
      new UseCaseUserPOCInformationUpdateUserID(
        config,
        drivenUserPOCInformationUpdateUserID,
        eventEmitter,
        logger,
        tracer,
      );
    const drivenUserPOCInformationUpdateUserIDSpy = vi.spyOn(
      drivenUserPOCInformationUpdateUserID,
      "updateUserId",
    );

    const brandUpdateUserID =
      await useCaseUserPOCInformationUpdateUserID.execute(
        drivingUserPOCInformationUpdateUserIDRequest,
      );

    expect(drivenUserPOCInformationUpdateUserIDSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationUpdateUserIDRequest,
    );
    const drivingUserPOCInformationUpdateUserIDResponse: PortDrivingUserPOCInformationUpdateUserIDResponse =
      {
        userId: drivingUserPOCInformationUpdateUserIDRequest.userId,
      };
    expect(brandUpdateUserID).toStrictEqual(
      drivingUserPOCInformationUpdateUserIDResponse,
    );
  });
});

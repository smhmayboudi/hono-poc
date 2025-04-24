import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCInformationDeleteUserID,
  PortDrivenUserPOCInformationDeleteUserIDRequest,
} from "../port/driven/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserIDRequest,
  PortDrivingUserPOCInformationDeleteUserIDResponse,
} from "../port/driving/user-poc-information-delete-user-id.ts";
import { UseCaseUserPOCInformationDeleteUserID } from "./user-poc-information-delete-user-id.ts";

describe("UserPOCInformation UseCase DeleteUserID", () => {
  const deleteMocks = (
    drivingUserPOCInformationDeleteUserIDRequest: PortDrivingUserPOCInformationDeleteUserIDRequest,
  ) => {
    const drivenUserPOCInformationDeleteUserIDRequest: PortDrivenUserPOCInformationDeleteUserIDRequest =
      {
        ...drivingUserPOCInformationDeleteUserIDRequest,
      };
    const drivenUserPOCInformationDeleteUserID =
      mock<PortDrivenUserPOCInformationDeleteUserID>({
        deleteUserId: vi.fn(),
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
      drivenUserPOCInformationDeleteUserID,
      drivenUserPOCInformationDeleteUserIDRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationDeleteUserIDRequest: PortDrivingUserPOCInformationDeleteUserIDRequest =
      {
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationDeleteUserID,
      drivenUserPOCInformationDeleteUserIDRequest,
      eventEmitter,
      logger,
      tracer,
    } = await deleteMocks(drivingUserPOCInformationDeleteUserIDRequest);
    const useCaseUserPOCInformationDeleteUserID =
      new UseCaseUserPOCInformationDeleteUserID(
        config,
        drivenUserPOCInformationDeleteUserID,
        eventEmitter,
        logger,
        tracer,
      );
    const drivenUserPOCInformationDeleteUserIDSpy = vi.spyOn(
      drivenUserPOCInformationDeleteUserID,
      "deleteUserId",
    );

    const brandDeleteUserID =
      await useCaseUserPOCInformationDeleteUserID.execute(
        drivingUserPOCInformationDeleteUserIDRequest,
      );

    expect(drivenUserPOCInformationDeleteUserIDSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationDeleteUserIDRequest,
    );
    const drivingUserPOCInformationDeleteUserIDResponse: PortDrivingUserPOCInformationDeleteUserIDResponse =
      {
        userId: drivingUserPOCInformationDeleteUserIDRequest.userId,
      };
    expect(brandDeleteUserID).toStrictEqual(
      drivingUserPOCInformationDeleteUserIDResponse,
    );
  });
});

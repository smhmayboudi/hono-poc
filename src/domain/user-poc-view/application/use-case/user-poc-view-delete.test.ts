import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivingUserPOCDelete,
  PortDrivingUserPOCDeleteRequest,
} from "../../../user-poc/application/port/driving/user-poc-delete.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserID,
  PortDrivingUserPOCInformationDeleteUserIDRequest,
} from "../../../user-poc-information/application/port/driving/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCViewDeleteRequest,
  PortDrivingUserPOCViewDeleteResponse,
} from "../port/driving/user-poc-view-delete.ts";
import { UseCaseUserPOCViewDelete } from "./user-poc-view-delete.ts";

describe("UserPOCView UseCase Delete", () => {
  const deleteMocks = (
    drivingUserPOCViewDeleteRequest: PortDrivingUserPOCViewDeleteRequest,
  ) => {
    const drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest = {
      id: drivingUserPOCViewDeleteRequest.id,
    };
    const drivingUserPOCDelete = mock<PortDrivingUserPOCDelete>({
      execute: vi
        .fn()
        .mockReturnValue({ id: drivingUserPOCViewDeleteRequest.id }),
    });

    const drivingUserPOCInformationDeleteUserIDRequest: PortDrivingUserPOCInformationDeleteUserIDRequest =
      {
        userId: drivingUserPOCViewDeleteRequest.id,
      };
    const drivingUserPOCInformationDeleteUserID =
      mock<PortDrivingUserPOCInformationDeleteUserID>({
        execute: vi
          .fn()
          .mockReturnValue({ id: drivingUserPOCViewDeleteRequest.id }),
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
      drivingUserPOCDelete,
      drivingUserPOCDeleteRequest,
      drivingUserPOCInformationDeleteUserID,
      drivingUserPOCInformationDeleteUserIDRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(3);

    const drivingUserPOCViewDeleteRequest: PortDrivingUserPOCViewDeleteRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivingUserPOCDelete,
      drivingUserPOCDeleteRequest,
      drivingUserPOCInformationDeleteUserID,
      drivingUserPOCInformationDeleteUserIDRequest,
      eventEmitter,
      logger,
      tracer,
    } = deleteMocks(drivingUserPOCViewDeleteRequest);
    const useCaseUserPOCViewDelete = new UseCaseUserPOCViewDelete(
      config,
      drivingUserPOCDelete,
      drivingUserPOCInformationDeleteUserID,
      eventEmitter,
      logger,
      tracer,
    );
    const drivingUserPOCDeleteSpy = vi.spyOn(drivingUserPOCDelete, "execute");
    const drivingUserPOCInformationDeleteUserIDSpy = vi.spyOn(
      drivingUserPOCInformationDeleteUserID,
      "execute",
    );

    const brandDelete = await useCaseUserPOCViewDelete.execute(
      drivingUserPOCViewDeleteRequest,
    );

    expect(drivingUserPOCDeleteSpy).toHaveBeenCalledWith(
      drivingUserPOCDeleteRequest,
    );
    expect(drivingUserPOCInformationDeleteUserIDSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationDeleteUserIDRequest,
    );
    const drivingUserPOCViewDeleteResponse: PortDrivingUserPOCViewDeleteResponse =
      {
        id: drivingUserPOCViewDeleteRequest.id,
      };
    expect(brandDelete).toStrictEqual(drivingUserPOCViewDeleteResponse);
  });
});

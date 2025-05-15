import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivingUserPOCUpdate,
  PortDrivingUserPOCUpdateRequest,
} from "../../../user-poc/application/port/driving/user-poc-update.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserID,
  PortDrivingUserPOCInformationUpdateUserIDRequest,
} from "../../../user-poc-information/application/port/driving/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCViewUpdateRequest,
  PortDrivingUserPOCViewUpdateResponse,
} from "../port/driving/user-poc-view-update.ts";
import { UseCaseUserPOCViewUpdate } from "./user-poc-view-update.ts";

describe("UserPOCView UseCase Update", () => {
  const updateMocks = (
    drivingUserPOCViewUpdateRequest: PortDrivingUserPOCViewUpdateRequest,
  ) => {
    const drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest = {
      id: drivingUserPOCViewUpdateRequest.id,
    };
    const drivingUserPOCUpdate = mock<PortDrivingUserPOCUpdate>({
      execute: vi
        .fn()
        .mockReturnValue({ id: drivingUserPOCViewUpdateRequest.id }),
    });

    const drivingUserPOCInformationUpdateUserIDRequest: PortDrivingUserPOCInformationUpdateUserIDRequest =
      {
        userId: drivingUserPOCViewUpdateRequest.id,
      };
    const drivingUserPOCInformationUpdateUserID =
      mock<PortDrivingUserPOCInformationUpdateUserID>({
        execute: vi
          .fn()
          .mockReturnValue({ id: drivingUserPOCViewUpdateRequest.id }),
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
      drivingUserPOCInformationUpdateUserID,
      drivingUserPOCInformationUpdateUserIDRequest,
      drivingUserPOCUpdate,
      drivingUserPOCUpdateRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(3);

    const drivingUserPOCViewUpdateRequest: PortDrivingUserPOCViewUpdateRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivingUserPOCInformationUpdateUserID,
      drivingUserPOCInformationUpdateUserIDRequest,
      drivingUserPOCUpdate,
      drivingUserPOCUpdateRequest,
      eventEmitter,
      logger,
      tracer,
    } = updateMocks(drivingUserPOCViewUpdateRequest);
    const useCaseUserPOCViewUpdate = new UseCaseUserPOCViewUpdate(
      config,
      drivingUserPOCUpdate,
      drivingUserPOCInformationUpdateUserID,
      eventEmitter,
      logger,
      tracer,
    );
    const drivingUserPOCUpdateSpy = vi.spyOn(drivingUserPOCUpdate, "execute");
    const drivingUserPOCInformationUpdateUserIDSpy = vi.spyOn(
      drivingUserPOCInformationUpdateUserID,
      "execute",
    );

    const brandUpdate = await useCaseUserPOCViewUpdate.execute(
      drivingUserPOCViewUpdateRequest,
    );

    expect(drivingUserPOCUpdateSpy).toHaveBeenCalledWith(
      drivingUserPOCUpdateRequest,
    );
    expect(drivingUserPOCInformationUpdateUserIDSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationUpdateUserIDRequest,
    );
    const drivingUserPOCViewUpdateResponse: PortDrivingUserPOCViewUpdateResponse =
      {
        id: drivingUserPOCViewUpdateRequest.id,
      };
    expect(brandUpdate).toStrictEqual(drivingUserPOCViewUpdateResponse);
  });
});

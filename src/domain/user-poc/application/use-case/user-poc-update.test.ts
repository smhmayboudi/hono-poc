import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCUpdate,
  PortDrivenUserPOCUpdateRequest,
} from "../port/driven/user-poc-update.ts";
import type {
  PortDrivingUserPOCUpdateRequest,
  PortDrivingUserPOCUpdateResponse,
} from "../port/driving/user-poc-update.ts";
import { UseCaseUserPOCUpdate } from "./user-poc-update.ts";

describe("UserPOC UseCase Update", () => {
  const updateMocks = (
    drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest,
  ) => {
    const drivenUserPOCUpdateRequest: PortDrivenUserPOCUpdateRequest = {
      ...drivingUserPOCUpdateRequest,
    };
    const drivenUserPOCUpdate = mock<PortDrivenUserPOCUpdate>({
      update: vi.fn(),
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
      drivenUserPOCUpdate,
      drivenUserPOCUpdateRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest = {
      fullname: faker.person.fullName(),
      id: faker.string.nanoid(24),
    };
    const {
      config,
      drivenUserPOCUpdate,
      drivenUserPOCUpdateRequest,
      eventEmitter,
      logger,
      tracer,
    } = await updateMocks(drivingUserPOCUpdateRequest);
    const useCaseUserPOCUpdate = new UseCaseUserPOCUpdate(
      config,
      drivenUserPOCUpdate,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCUpdateSpy = vi.spyOn(drivenUserPOCUpdate, "update");

    const brandUpdate = await useCaseUserPOCUpdate.execute(
      drivingUserPOCUpdateRequest,
    );

    expect(drivenUserPOCUpdateSpy).toHaveBeenCalledWith(
      drivenUserPOCUpdateRequest,
    );
    const drivingUserPOCUpdateResponse: PortDrivingUserPOCUpdateResponse = {
      id: drivingUserPOCUpdateRequest.id,
    };
    expect(brandUpdate).toStrictEqual(drivingUserPOCUpdateResponse);
  });
});

import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCInformationUpdate,
  PortDrivenUserPOCInformationUpdateRequest,
} from "../port/driven/user-poc-information-update.ts";
import type {
  PortDrivingUserPOCInformationUpdateRequest,
  PortDrivingUserPOCInformationUpdateResponse,
} from "../port/driving/user-poc-information-update.ts";
import { UseCaseUserPOCInformationUpdate } from "./user-poc-information-update.ts";

describe("UserPOCInformation UseCase Update", () => {
  const updateMocks = (
    drivingUserPOCInformationUpdateRequest: PortDrivingUserPOCInformationUpdateRequest,
  ) => {
    const drivenUserPOCInformationUpdateRequest: PortDrivenUserPOCInformationUpdateRequest =
      {
        ...drivingUserPOCInformationUpdateRequest,
      };
    const drivenUserPOCInformationUpdate =
      mock<PortDrivenUserPOCInformationUpdate>({
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
      drivenUserPOCInformationUpdate,
      drivenUserPOCInformationUpdateRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationUpdateRequest: PortDrivingUserPOCInformationUpdateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        id: faker.string.nanoid(24),
        userId: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationUpdate,
      drivenUserPOCInformationUpdateRequest,
      eventEmitter,
      logger,
      tracer,
    } = await updateMocks(drivingUserPOCInformationUpdateRequest);
    const useCaseUserPOCInformationUpdate = new UseCaseUserPOCInformationUpdate(
      config,
      drivenUserPOCInformationUpdate,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCInformationUpdateSpy = vi.spyOn(
      drivenUserPOCInformationUpdate,
      "update",
    );

    const brandUpdate = await useCaseUserPOCInformationUpdate.execute(
      drivingUserPOCInformationUpdateRequest,
    );

    expect(drivenUserPOCInformationUpdateSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationUpdateRequest,
    );
    const drivingUserPOCInformationUpdateResponse: PortDrivingUserPOCInformationUpdateResponse =
      {
        id: drivingUserPOCInformationUpdateRequest.id,
      };
    expect(brandUpdate).toStrictEqual(drivingUserPOCInformationUpdateResponse);
  });
});

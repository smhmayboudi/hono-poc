import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCInformationDelete,
  PortDrivenUserPOCInformationDeleteRequest,
} from "../port/driven/user-poc-information-delete.ts";
import type {
  PortDrivingUserPOCInformationDeleteRequest,
  PortDrivingUserPOCInformationDeleteResponse,
} from "../port/driving/user-poc-information-delete.ts";
import { UseCaseUserPOCInformationDelete } from "./user-poc-information-delete.ts";

describe("UserPOCInformation UseCase Delete", () => {
  const deleteMocks = (
    drivingUserPOCInformationDeleteRequest: PortDrivingUserPOCInformationDeleteRequest,
  ) => {
    const drivenUserPOCInformationDeleteRequest: PortDrivenUserPOCInformationDeleteRequest =
      {
        ...drivingUserPOCInformationDeleteRequest,
      };
    const drivenUserPOCInformationDelete =
      mock<PortDrivenUserPOCInformationDelete>({
        delete: vi.fn(),
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
      drivenUserPOCInformationDelete,
      drivenUserPOCInformationDeleteRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCInformationDeleteRequest: PortDrivingUserPOCInformationDeleteRequest =
      {
        id: faker.string.nanoid(24),
      };
    const {
      config,
      drivenUserPOCInformationDelete,
      drivenUserPOCInformationDeleteRequest,
      eventEmitter,
      logger,
      tracer,
    } = deleteMocks(drivingUserPOCInformationDeleteRequest);
    const useCaseUserPOCInformationDelete = new UseCaseUserPOCInformationDelete(
      config,
      drivenUserPOCInformationDelete,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCInformationDeleteSpy = vi.spyOn(
      drivenUserPOCInformationDelete,
      "delete",
    );

    const brandDelete = await useCaseUserPOCInformationDelete.execute(
      drivingUserPOCInformationDeleteRequest,
    );

    expect(drivenUserPOCInformationDeleteSpy).toHaveBeenCalledWith(
      drivenUserPOCInformationDeleteRequest,
    );
    const drivingUserPOCInformationDeleteResponse: PortDrivingUserPOCInformationDeleteResponse =
      {
        id: drivingUserPOCInformationDeleteRequest.id,
      };
    expect(brandDelete).toStrictEqual(drivingUserPOCInformationDeleteResponse);
  });
});

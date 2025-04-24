import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCDelete,
  PortDrivenUserPOCDeleteRequest,
} from "../port/driven/user-poc-delete.ts";
import type {
  PortDrivingUserPOCDeleteRequest,
  PortDrivingUserPOCDeleteResponse,
} from "../port/driving/user-poc-delete.ts";
import { UseCaseUserPOCDelete } from "./user-poc-delete.ts";

describe("UserPOC UseCase Delete", () => {
  const deleteMocks = (
    drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest,
  ) => {
    const drivenUserPOCDeleteRequest: PortDrivenUserPOCDeleteRequest = {
      ...drivingUserPOCDeleteRequest,
    };
    const drivenUserPOCDelete = mock<PortDrivenUserPOCDelete>({
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
      drivenUserPOCDelete,
      drivenUserPOCDeleteRequest,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest = {
      id: faker.string.nanoid(24),
    };
    const {
      config,
      drivenUserPOCDelete,
      drivenUserPOCDeleteRequest,
      eventEmitter,
      logger,
      tracer,
    } = await deleteMocks(drivingUserPOCDeleteRequest);
    const useCaseUserPOCDelete = new UseCaseUserPOCDelete(
      config,
      drivenUserPOCDelete,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCDeleteSpy = vi.spyOn(drivenUserPOCDelete, "delete");

    const brandDelete = await useCaseUserPOCDelete.execute(
      drivingUserPOCDeleteRequest,
    );

    expect(drivenUserPOCDeleteSpy).toHaveBeenCalledWith(
      drivenUserPOCDeleteRequest,
    );
    const drivingUserPOCDeleteResponse: PortDrivingUserPOCDeleteResponse = {
      id: drivingUserPOCDeleteRequest.id,
    };
    expect(brandDelete).toStrictEqual(drivingUserPOCDeleteResponse);
  });
});

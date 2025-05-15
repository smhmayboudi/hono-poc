import { faker } from "@faker-js/faker";
import type { Context, Span, SpanOptions } from "@opentelemetry/api";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCViewSearch,
  PortDrivenUserPOCViewSearchRequest,
  PortDrivenUserPOCViewSearchResponse,
} from "../port/driven/user-poc-view-search.ts";
import type {
  PortDrivingUserPOCViewSearchRequest,
  PortDrivingUserPOCViewSearchResponse,
} from "../port/driving/user-poc-view-search.ts";
import { UseCaseUserPOCViewSearch } from "./user-poc-view-search.ts";

describe("UserPOCView UseCase Search", () => {
  const readMocks = (
    drivingUserPOCViewSearchRequest: PortDrivingUserPOCViewSearchRequest,
  ) => {
    const drivenUserPOCViewSearchRequest: PortDrivenUserPOCViewSearchRequest = {
      ...drivingUserPOCViewSearchRequest,
    };
    const drivenUserPOCViewSearchResponse: PortDrivenUserPOCViewSearchResponse =
      [
        {
          address: faker.location.streetAddress(),
          age: faker.number.int(),
          fullname: drivingUserPOCViewSearchRequest.query,
          id: faker.string.nanoid(24),
        },
      ];
    const drivenUserPOCViewSearch = mock<PortDrivenUserPOCViewSearch>({
      search: vi.fn().mockResolvedValue(drivenUserPOCViewSearchResponse),
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
      drivenUserPOCViewSearch,
      drivenUserPOCViewSearchRequest,
      drivenUserPOCViewSearchResponse,
      eventEmitter,
      logger,
      tracer,
    };
  };

  it("should call execute with correct data", async () => {
    expect.assertions(2);

    const drivingUserPOCViewSearchRequest: PortDrivingUserPOCViewSearchRequest =
      { query: faker.person.fullName() };
    const {
      config,
      drivenUserPOCViewSearch,
      drivenUserPOCViewSearchRequest,
      drivenUserPOCViewSearchResponse,
      eventEmitter,
      logger,
      tracer,
    } = readMocks(drivingUserPOCViewSearchRequest);
    const useCaseUserPOCViewSearch = new UseCaseUserPOCViewSearch(
      config,
      drivenUserPOCViewSearch,
      eventEmitter,
      logger,
      tracer,
    );
    const drivenUserPOCViewSearchSpy = vi.spyOn(
      drivenUserPOCViewSearch,
      "search",
    );

    const userPOCSearch = await useCaseUserPOCViewSearch.execute(
      drivingUserPOCViewSearchRequest,
    );

    expect(drivenUserPOCViewSearchSpy).toHaveBeenCalledWith(
      drivenUserPOCViewSearchRequest,
    );
    const drivingUserPOCViewSearchResponse: PortDrivingUserPOCViewSearchResponse =
      drivenUserPOCViewSearchResponse;
    expect(userPOCSearch).toStrictEqual(drivingUserPOCViewSearchResponse);
  });
});

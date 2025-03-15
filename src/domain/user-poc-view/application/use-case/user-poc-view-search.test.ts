import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
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

    return {
      config,
      drivenUserPOCViewSearch,
      drivenUserPOCViewSearchRequest,
      drivenUserPOCViewSearchResponse,
      eventEmitter,
      logger,
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
    } = await readMocks(drivingUserPOCViewSearchRequest);
    const useCaseUserPOCViewSearch = new UseCaseUserPOCViewSearch(
      config,
      drivenUserPOCViewSearch,
      eventEmitter,
      logger,
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

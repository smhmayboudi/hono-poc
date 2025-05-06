import { faker } from "@faker-js/faker";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../../../../../shared/adapter/driving/default-hook.ts";
import { successArrayResponse } from "../../../../../shared/adapter/driving/response/success-array.ts";
import type {
  PortDrivingUserPOCViewSearch,
  PortDrivingUserPOCViewSearchRequest,
  PortDrivingUserPOCViewSearchResponse,
} from "../../../application/port/driving/user-poc-view-search.ts";
import { adapterDrivingUserPOCViewSearch } from "./user-poc-view-search.driving.ts";

describe("UserPOCView Driving Search", () => {
  const readMocks = (
    drivingUserPOCViewSearchResponse: PortDrivingUserPOCViewSearchResponse,
  ) => {
    const drivingUserPOCViewSearch = mock<PortDrivingUserPOCViewSearch>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCViewSearchResponse),
    });

    const app = new OpenAPIHono<Env>({ defaultHook });
    const basePath = "/api/v1";
    const config = mock<PortConfig>();
    const domainType = "user-poc-view";
    const logger = mock<PortLogger>();

    return {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewSearch,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCViewSearchRequest: PortDrivingUserPOCViewSearchRequest =
      {
        query: faker.person.fullName(),
      };
    const drivingUserPOCViewSearchResponse: PortDrivingUserPOCViewSearchResponse =
      [
        {
          address: faker.location.streetAddress(),
          age: faker.number.int(),
          fullname: drivingUserPOCViewSearchRequest.query,
          id: faker.string.nanoid(24),
        },
      ];
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewSearch,
      logger,
    } = readMocks(drivingUserPOCViewSearchResponse);
    adapterDrivingUserPOCViewSearch(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewSearch,
    );
    const drivingUserPOCViewSearchSpy = vi.spyOn(
      drivingUserPOCViewSearch,
      "execute",
    );

    const response = await app.request(`${basePath}/${domainType}/search`, {
      body: JSON.stringify(drivingUserPOCViewSearchRequest),
      headers: [["Content-Type", "application/json"]],
      method: "POST",
    });

    expect(drivingUserPOCViewSearchSpy).toHaveBeenCalledWith(
      drivingUserPOCViewSearchRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successArrayResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCViewSearchResponse[0]?.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCViewSearchResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

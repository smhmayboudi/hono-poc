import { faker } from "@faker-js/faker";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../../../../../shared/adapter/driving/default-hook.ts";
import { successResponse200 } from "../../../../../shared/adapter/driving/response/success.ts";
import type {
  PortDrivingUserPOCViewReadID,
  PortDrivingUserPOCViewReadIDRequest,
  PortDrivingUserPOCViewReadIDResponse,
} from "../../../application/port/driving/user-poc-view-read-id.ts";
import { adapterDrivingUserPOCViewReadID } from "./user-poc-view-read-id.driving.ts";

describe("UserPOCView Driving ReadID", () => {
  const readMocks = (
    drivingUserPOCViewReadIDResponse: PortDrivingUserPOCViewReadIDResponse,
  ) => {
    const drivingUserPOCViewReadID = mock<PortDrivingUserPOCViewReadID>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCViewReadIDResponse),
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
      drivingUserPOCViewReadID,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCViewReadIDRequest: PortDrivingUserPOCViewReadIDRequest =
      {
        id: faker.string.nanoid(24),
      };
    const drivingUserPOCViewReadIDResponse: PortDrivingUserPOCViewReadIDResponse =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
        id: drivingUserPOCViewReadIDRequest.id,
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewReadID,
      logger,
    } = readMocks(drivingUserPOCViewReadIDResponse);
    adapterDrivingUserPOCViewReadID(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewReadID,
    );
    const drivingUserPOCViewReadIDSpy = vi.spyOn(
      drivingUserPOCViewReadID,
      "execute",
    );

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCViewReadIDRequest.id}`,
      {
        headers: [["Content-Type", "application/json"]],
        method: "GET",
      },
    );

    expect(drivingUserPOCViewReadIDSpy).toHaveBeenCalledWith(
      drivingUserPOCViewReadIDRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse200(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCViewReadIDResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCViewReadIDResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

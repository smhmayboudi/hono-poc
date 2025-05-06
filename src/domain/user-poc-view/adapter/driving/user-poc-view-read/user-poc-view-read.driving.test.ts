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
  PortDrivingUserPOCViewRead,
  PortDrivingUserPOCViewReadRequest,
  PortDrivingUserPOCViewReadResponse,
} from "../../../application/port/driving/user-poc-view-read.ts";
import { adapterDrivingUserPOCViewRead } from "./user-poc-view-read.driving.ts";

describe("UserPOCView Driving Read", () => {
  const readMocks = (
    drivingUserPOCViewReadResponse: PortDrivingUserPOCViewReadResponse,
  ) => {
    const drivingUserPOCViewRead = mock<PortDrivingUserPOCViewRead>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCViewReadResponse),
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
      drivingUserPOCViewRead,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCViewReadRequest: PortDrivingUserPOCViewReadRequest = {};
    const drivingUserPOCViewReadResponse: PortDrivingUserPOCViewReadResponse = [
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
        id: faker.string.nanoid(24),
      },
    ];
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewRead,
      logger,
    } = readMocks(drivingUserPOCViewReadResponse);
    adapterDrivingUserPOCViewRead(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewRead,
    );
    const drivingUserPOCViewReadSpy = vi.spyOn(
      drivingUserPOCViewRead,
      "execute",
    );

    const response = await app.request(`${basePath}/${domainType}`, {
      headers: [["Content-Type", "application/json"]],
      method: "GET",
    });

    expect(drivingUserPOCViewReadSpy).toHaveBeenCalledWith(
      drivingUserPOCViewReadRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successArrayResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCViewReadResponse[0]?.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCViewReadResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

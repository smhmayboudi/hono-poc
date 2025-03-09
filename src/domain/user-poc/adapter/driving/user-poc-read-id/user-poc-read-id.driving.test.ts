import { faker } from "@faker-js/faker";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../../../../../shared/adapter/driving/default-hook.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type {
  PortDrivingUserPOCReadID,
  PortDrivingUserPOCReadIDRequest,
  PortDrivingUserPOCReadIDResponse,
} from "../../../application/port/driving/user-poc-read-id.ts";
import { adapterDrivingUserPOCReadID } from "./user-poc-read-id.driving.ts";

describe("UserPOC Driving ReadID", () => {
  const readMocks = (
    drivingUserPOCReadIDResponse: PortDrivingUserPOCReadIDResponse,
  ) => {
    const drivingUserPOCReadID = mock<PortDrivingUserPOCReadID>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCReadIDResponse),
    });

    const app = new OpenAPIHono<Env>({ defaultHook });
    const basePath = "/api/v1";
    const config = mock<PortConfig>();
    const domainType = "user-poc";
    const logger = mock<PortLogger>();

    return {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCReadID,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCReadIDRequest: PortDrivingUserPOCReadIDRequest = {
      id: faker.string.nanoid(24),
    };
    const drivingUserPOCReadIDResponse: PortDrivingUserPOCReadIDResponse = {
      fullname: faker.person.fullName(),
      id: drivingUserPOCReadIDRequest.id,
    };
    const { app, basePath, config, domainType, drivingUserPOCReadID, logger } =
      await readMocks(drivingUserPOCReadIDResponse);
    adapterDrivingUserPOCReadID(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCReadID,
    );
    const drivingUserPOCReadIDSpy = vi.spyOn(drivingUserPOCReadID, "execute");

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCReadIDRequest.id}`,
      {
        headers: [["Content-Type", "application/json"]],
        method: "GET",
      },
    );

    expect(drivingUserPOCReadIDSpy).toHaveBeenCalledWith(
      drivingUserPOCReadIDRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCReadIDResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCReadIDResponse,
      true,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

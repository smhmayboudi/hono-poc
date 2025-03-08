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
  PortDrivingUserPOCRead,
  PortDrivingUserPOCReadRequest,
  PortDrivingUserPOCReadResponse,
} from "../../../application/port/driving/user-poc-read.ts";
import { adapterDrivingUserPOCRead } from "./user-poc-read.driving.ts";

describe("UserPOC Driving Read", () => {
  const readMocks = (
    drivingUserPOCReadResponse: PortDrivingUserPOCReadResponse,
  ) => {
    const drivingUserPOCRead = mock<PortDrivingUserPOCRead>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCReadResponse),
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
      drivingUserPOCRead,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCReadRequest: PortDrivingUserPOCReadRequest = {};
    const drivingUserPOCReadResponse: PortDrivingUserPOCReadResponse = [
      {
        fullname: faker.person.fullName(),
        id: faker.string.nanoid(24),
      },
    ];
    const { app, basePath, config, domainType, drivingUserPOCRead, logger } =
      await readMocks(drivingUserPOCReadResponse);
    adapterDrivingUserPOCRead(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCRead,
    );
    const drivingUserPOCReadSpy = vi.spyOn(drivingUserPOCRead, "execute");

    const response = await app.request(`${basePath}/${domainType}`, {
      headers: [["Content-Type", "application/vnd.api+json"]],
      method: "GET",
    });

    expect(drivingUserPOCReadSpy).toHaveBeenCalledWith(
      drivingUserPOCReadRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successArrayResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCReadResponse[0]?.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCReadResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

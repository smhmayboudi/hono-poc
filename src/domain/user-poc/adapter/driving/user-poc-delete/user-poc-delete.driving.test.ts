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
  PortDrivingUserPOCDelete,
  PortDrivingUserPOCDeleteRequest,
  PortDrivingUserPOCDeleteResponse,
} from "../../../application/port/driving/user-poc-delete.ts";
import { adapterDrivingUserPOCDelete } from "./user-poc-delete.driving.ts";

describe("UserPOC Driving Delete", () => {
  const deleteMocks = (
    drivingUserPOCDeleteResponse: PortDrivingUserPOCDeleteResponse,
  ) => {
    const drivingUserPOCDelete = mock<PortDrivingUserPOCDelete>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCDeleteResponse),
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
      drivingUserPOCDelete,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCDeleteRequest: PortDrivingUserPOCDeleteRequest = {
      id: faker.string.nanoid(24),
    };
    const drivingUserPOCDeleteResponse: PortDrivingUserPOCDeleteResponse = {
      id: drivingUserPOCDeleteRequest.id,
    };
    const { app, basePath, config, domainType, drivingUserPOCDelete, logger } =
      await deleteMocks(drivingUserPOCDeleteResponse);
    adapterDrivingUserPOCDelete(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCDelete,
    );
    const drivingUserPOCDeleteSpy = vi.spyOn(drivingUserPOCDelete, "execute");

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCDeleteRequest.id}`,
      {
        headers: [["Content-Type", "application/json"]],
        method: "DELETE",
      },
    );

    expect(drivingUserPOCDeleteSpy).toHaveBeenCalledWith(
      drivingUserPOCDeleteRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCDeleteResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCDeleteRequest,
      true,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

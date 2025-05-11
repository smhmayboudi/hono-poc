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
  PortDrivingUserPOCViewDelete,
  PortDrivingUserPOCViewDeleteRequest,
  PortDrivingUserPOCViewDeleteResponse,
} from "../../../application/port/driving/user-poc-view-delete.ts";
import { adapterDrivingUserPOCViewDelete } from "./user-poc-view-delete.driving.ts";

describe("UserPOCView Driving Delete", () => {
  const deleteMocks = (
    drivingUserPOCViewDeleteResponse: PortDrivingUserPOCViewDeleteResponse,
  ) => {
    const drivingUserPOCViewDelete = mock<PortDrivingUserPOCViewDelete>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCViewDeleteResponse),
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
      drivingUserPOCViewDelete,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCViewDeleteRequest: PortDrivingUserPOCViewDeleteRequest =
      {
        id: faker.string.nanoid(24),
      };
    const drivingUserPOCViewDeleteResponse: PortDrivingUserPOCViewDeleteResponse =
      {
        id: drivingUserPOCViewDeleteRequest.id,
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewDelete,
      logger,
    } = deleteMocks(drivingUserPOCViewDeleteResponse);
    adapterDrivingUserPOCViewDelete(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewDelete,
    );
    const drivingUserPOCViewDeleteSpy = vi.spyOn(
      drivingUserPOCViewDelete,
      "execute",
    );

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCViewDeleteRequest.id}`,
      {
        headers: [["Content-Type", "application/json"]],
        method: "DELETE",
      },
    );

    expect(drivingUserPOCViewDeleteSpy).toHaveBeenCalledWith(
      drivingUserPOCViewDeleteRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse200(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCViewDeleteResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCViewDeleteRequest,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

import { faker } from "@faker-js/faker";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../../../../../shared/adapter/driving/default-hook.ts";
import { successResponse201 } from "../../../../../shared/adapter/driving/response/success.ts";
import type {
  PortDrivingUserPOCCreate,
  PortDrivingUserPOCCreateRequest,
  PortDrivingUserPOCCreateResponse,
} from "../../../application/port/driving/user-poc-create.ts";
import { adapterDrivingUserPOCCreate } from "./user-poc-create.driving.ts";

describe("UserPOC Driving Create", () => {
  const createMocks = (
    drivingUserPOCCreateResponse: PortDrivingUserPOCCreateResponse,
  ) => {
    const drivingUserPOCCreate = mock<PortDrivingUserPOCCreate>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCCreateResponse),
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
      drivingUserPOCCreate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCCreateRequest: PortDrivingUserPOCCreateRequest = {
      fullname: faker.person.fullName(),
    };
    const drivingUserPOCCreateResponse: PortDrivingUserPOCCreateResponse = {
      id: faker.string.nanoid(24),
    };
    const { app, basePath, config, domainType, drivingUserPOCCreate, logger } =
      createMocks(drivingUserPOCCreateResponse);
    adapterDrivingUserPOCCreate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCCreate,
    );
    const drivingUserPOCCreateSpy = vi.spyOn(drivingUserPOCCreate, "execute");

    const response = await app.request(`${basePath}/${domainType}`, {
      body: JSON.stringify(drivingUserPOCCreateRequest),
      headers: [["Content-Type", "application/json"]],
      method: "POST",
    });

    expect(drivingUserPOCCreateSpy).toHaveBeenCalledWith(
      drivingUserPOCCreateRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse201(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCCreateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      {
        ...drivingUserPOCCreateRequest,
        ...drivingUserPOCCreateResponse,
      },
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(201);
  });
});

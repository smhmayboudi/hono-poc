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
  PortDrivingUserPOCViewCreate,
  PortDrivingUserPOCViewCreateRequest,
  PortDrivingUserPOCViewCreateResponse,
} from "../../../application/port/driving/user-poc-view-create.ts";
import { adapterDrivingUserPOCViewCreate } from "./user-poc-view-create.driving.ts";

describe("UserPOCView Driving Create", () => {
  const createMocks = (
    drivingUserPOCViewCreateResponse: PortDrivingUserPOCViewCreateResponse,
  ) => {
    const drivingUserPOCViewCreate = mock<PortDrivingUserPOCViewCreate>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCViewCreateResponse),
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
      drivingUserPOCViewCreate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCViewCreateRequest: PortDrivingUserPOCViewCreateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
      };
    const drivingUserPOCViewCreateResponse: PortDrivingUserPOCViewCreateResponse =
      {
        id: faker.string.nanoid(24),
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewCreate,
      logger,
    } = createMocks(drivingUserPOCViewCreateResponse);
    adapterDrivingUserPOCViewCreate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewCreate,
    );
    const drivingUserPOCViewCreateSpy = vi.spyOn(
      drivingUserPOCViewCreate,
      "execute",
    );

    const response = await app.request(`${basePath}/${domainType}`, {
      body: JSON.stringify(drivingUserPOCViewCreateRequest),
      headers: [["Content-Type", "application/json"]],
      method: "POST",
    });

    expect(drivingUserPOCViewCreateSpy).toHaveBeenCalledWith(
      drivingUserPOCViewCreateRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse201(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCViewCreateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      {
        ...drivingUserPOCViewCreateRequest,
        ...drivingUserPOCViewCreateResponse,
      },
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(201);
  });
});

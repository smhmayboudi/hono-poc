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
  PortDrivingUserPOCInformationCreate,
  PortDrivingUserPOCInformationCreateRequest,
  PortDrivingUserPOCInformationCreateResponse,
} from "../../../application/port/driving/user-poc-information-create.ts";
import { adapterDrivingUserPOCInformationCreate } from "./user-poc-information-create.driving.ts";

describe("UserPOCInformation Driving Create", () => {
  const createMocks = (
    drivingUserPOCInformationCreateResponse: PortDrivingUserPOCInformationCreateResponse,
  ) => {
    const drivingUserPOCInformationCreate =
      mock<PortDrivingUserPOCInformationCreate>({
        execute: vi
          .fn()
          .mockResolvedValue(drivingUserPOCInformationCreateResponse),
      });

    const app = new OpenAPIHono<Env>({ defaultHook });
    const basePath = "/api/v1";
    const config = mock<PortConfig>();
    const domainType = "user-poc-information";
    const logger = mock<PortLogger>();

    return {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCInformationCreate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCInformationCreateRequest: PortDrivingUserPOCInformationCreateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        userId: faker.string.nanoid(24),
      };
    const drivingUserPOCInformationCreateResponse: PortDrivingUserPOCInformationCreateResponse =
      {
        id: faker.string.nanoid(24),
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCInformationCreate,
      logger,
    } = await createMocks(drivingUserPOCInformationCreateResponse);
    adapterDrivingUserPOCInformationCreate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationCreate,
    );
    const drivingUserPOCInformationCreateSpy = vi.spyOn(
      drivingUserPOCInformationCreate,
      "execute",
    );

    const response = await app.request(`${basePath}/${domainType}`, {
      body: JSON.stringify(drivingUserPOCInformationCreateRequest),
      headers: [["Content-Type", "application/json"]],
      method: "POST",
    });

    expect(drivingUserPOCInformationCreateSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationCreateRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCInformationCreateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      {
        ...drivingUserPOCInformationCreateRequest,
        ...drivingUserPOCInformationCreateResponse,
      },
      true,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(201);
  });
});

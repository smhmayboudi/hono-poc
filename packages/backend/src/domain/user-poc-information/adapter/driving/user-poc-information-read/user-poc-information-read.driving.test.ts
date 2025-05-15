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
  PortDrivingUserPOCInformationRead,
  PortDrivingUserPOCInformationReadRequest,
  PortDrivingUserPOCInformationReadResponse,
} from "../../../application/port/driving/user-poc-information-read.ts";
import { adapterDrivingUserPOCInformationRead } from "./user-poc-information-read.driving.ts";

describe("UserPOCInformation Driving Read", () => {
  const readMocks = (
    drivingUserPOCInformationReadResponse: PortDrivingUserPOCInformationReadResponse,
  ) => {
    const drivingUserPOCInformationRead =
      mock<PortDrivingUserPOCInformationRead>({
        execute: vi
          .fn()
          .mockResolvedValue(drivingUserPOCInformationReadResponse),
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
      drivingUserPOCInformationRead,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCInformationReadRequest: PortDrivingUserPOCInformationReadRequest =
      {};
    const drivingUserPOCInformationReadResponse: PortDrivingUserPOCInformationReadResponse =
      [
        {
          address: faker.location.streetAddress(),
          age: faker.number.int(),
          id: faker.string.nanoid(24),
          userId: faker.string.nanoid(24),
        },
      ];
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCInformationRead,
      logger,
    } = readMocks(drivingUserPOCInformationReadResponse);
    adapterDrivingUserPOCInformationRead(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationRead,
    );
    const drivingUserPOCInformationReadSpy = vi.spyOn(
      drivingUserPOCInformationRead,
      "execute",
    );

    const response = await app.request(`${basePath}/${domainType}`, {
      headers: [["Content-Type", "application/json"]],
      method: "GET",
    });

    expect(drivingUserPOCInformationReadSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationReadRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successArrayResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCInformationReadResponse[0]?.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCInformationReadResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

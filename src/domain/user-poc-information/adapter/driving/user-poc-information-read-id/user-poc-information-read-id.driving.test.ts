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
  PortDrivingUserPOCInformationReadID,
  PortDrivingUserPOCInformationReadIDRequest,
  PortDrivingUserPOCInformationReadIDResponse,
} from "../../../application/port/driving/user-poc-information-read-id.ts";
import { adapterDrivingUserPOCInformationReadID } from "./user-poc-information-read-id.driving.ts";

describe("UserPOCInformation Driving ReadID", () => {
  const readMocks = (
    drivingUserPOCInformationReadIDResponse: PortDrivingUserPOCInformationReadIDResponse,
  ) => {
    const drivingUserPOCInformationReadID =
      mock<PortDrivingUserPOCInformationReadID>({
        execute: vi
          .fn()
          .mockResolvedValue(drivingUserPOCInformationReadIDResponse),
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
      drivingUserPOCInformationReadID,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCInformationReadIDRequest: PortDrivingUserPOCInformationReadIDRequest =
      {
        id: faker.string.nanoid(24),
      };
    const drivingUserPOCInformationReadIDResponse: PortDrivingUserPOCInformationReadIDResponse =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        id: drivingUserPOCInformationReadIDRequest.id,
        userId: faker.string.nanoid(24),
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCInformationReadID,
      logger,
    } = readMocks(drivingUserPOCInformationReadIDResponse);
    adapterDrivingUserPOCInformationReadID(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationReadID,
    );
    const drivingUserPOCInformationReadIDSpy = vi.spyOn(
      drivingUserPOCInformationReadID,
      "execute",
    );

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCInformationReadIDRequest.id}`,
      {
        headers: [["Content-Type", "application/json"]],
        method: "GET",
      },
    );

    expect(drivingUserPOCInformationReadIDSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationReadIDRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCInformationReadIDResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCInformationReadIDResponse,
      true,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

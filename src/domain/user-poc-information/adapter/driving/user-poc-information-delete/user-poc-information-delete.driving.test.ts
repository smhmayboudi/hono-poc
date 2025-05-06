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
  PortDrivingUserPOCInformationDelete,
  PortDrivingUserPOCInformationDeleteRequest,
  PortDrivingUserPOCInformationDeleteResponse,
} from "../../../application/port/driving/user-poc-information-delete.ts";
import { adapterDrivingUserPOCInformationDelete } from "./user-poc-information-delete.driving.ts";

describe("UserPOCInformation Driving Delete", () => {
  const deleteMocks = (
    drivingUserPOCInformationDeleteResponse: PortDrivingUserPOCInformationDeleteResponse,
  ) => {
    const drivingUserPOCInformationDelete =
      mock<PortDrivingUserPOCInformationDelete>({
        execute: vi
          .fn()
          .mockResolvedValue(drivingUserPOCInformationDeleteResponse),
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
      drivingUserPOCInformationDelete,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCInformationDeleteRequest: PortDrivingUserPOCInformationDeleteRequest =
      {
        id: faker.string.nanoid(24),
      };
    const drivingUserPOCInformationDeleteResponse: PortDrivingUserPOCInformationDeleteResponse =
      {
        id: drivingUserPOCInformationDeleteRequest.id,
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCInformationDelete,
      logger,
    } = deleteMocks(drivingUserPOCInformationDeleteResponse);
    adapterDrivingUserPOCInformationDelete(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationDelete,
    );
    const drivingUserPOCInformationDeleteSpy = vi.spyOn(
      drivingUserPOCInformationDelete,
      "execute",
    );

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCInformationDeleteRequest.id}`,
      {
        headers: [["Content-Type", "application/json"]],
        method: "DELETE",
      },
    );

    expect(drivingUserPOCInformationDeleteSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationDeleteRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCInformationDeleteResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCInformationDeleteRequest,
      true,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

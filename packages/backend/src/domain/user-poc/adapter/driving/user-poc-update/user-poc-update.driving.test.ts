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
import { objectPropertiesOmit } from "../../../../../util/object-properties-omit.ts";
import type {
  PortDrivingUserPOCUpdate,
  PortDrivingUserPOCUpdateRequest,
  PortDrivingUserPOCUpdateResponse,
} from "../../../application/port/driving/user-poc-update.ts";
import { adapterDrivingUserPOCUpdate } from "./user-poc-update.driving.ts";

describe("UserPOC Driving Update", () => {
  const updateMocks = (
    drivingUserPOCUpdateResponse: PortDrivingUserPOCUpdateResponse,
  ) => {
    const drivingUserPOCUpdate = mock<PortDrivingUserPOCUpdate>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCUpdateResponse),
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
      drivingUserPOCUpdate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCUpdateRequest: PortDrivingUserPOCUpdateRequest = {
      fullname: faker.person.fullName(),
      id: faker.string.nanoid(24),
    };
    const drivingUserPOCUpdateResponse: PortDrivingUserPOCUpdateResponse = {
      id: drivingUserPOCUpdateRequest.id,
    };
    const { app, basePath, config, domainType, drivingUserPOCUpdate, logger } =
      updateMocks(drivingUserPOCUpdateResponse);
    adapterDrivingUserPOCUpdate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCUpdate,
    );
    const drivingUserPOCUpdateSpy = vi.spyOn(drivingUserPOCUpdate, "execute");

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCUpdateRequest.id}`,
      {
        body: JSON.stringify(
          objectPropertiesOmit(drivingUserPOCUpdateRequest, ["id"]),
        ),
        headers: [["Content-Type", "application/json"]],
        method: "PATCH",
      },
    );

    expect(drivingUserPOCUpdateSpy).toHaveBeenCalledWith(
      drivingUserPOCUpdateRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse200(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCUpdateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCUpdateResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

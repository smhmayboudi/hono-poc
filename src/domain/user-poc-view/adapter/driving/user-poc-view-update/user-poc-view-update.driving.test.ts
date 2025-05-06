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
import { objectPropertiesOmit } from "../../../../../util/object-properties-omit.ts";
import type {
  PortDrivingUserPOCViewUpdate,
  PortDrivingUserPOCViewUpdateRequest,
  PortDrivingUserPOCViewUpdateResponse,
} from "../../../application/port/driving/user-poc-view-update.ts";
import { adapterDrivingUserPOCViewUpdate } from "./user-poc-view-update.driving.ts";

describe("UserPOCView Driving Update", () => {
  const updateMocks = (
    drivingUserPOCViewUpdateResponse: PortDrivingUserPOCViewUpdateResponse,
  ) => {
    const drivingUserPOCViewUpdate = mock<PortDrivingUserPOCViewUpdate>({
      execute: vi.fn().mockResolvedValue(drivingUserPOCViewUpdateResponse),
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
      drivingUserPOCViewUpdate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCViewUpdateRequest: PortDrivingUserPOCViewUpdateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        fullname: faker.person.fullName(),
        id: faker.string.nanoid(24),
      };
    const drivingUserPOCViewUpdateResponse: PortDrivingUserPOCViewUpdateResponse =
      {
        id: drivingUserPOCViewUpdateRequest.id,
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCViewUpdate,
      logger,
    } = updateMocks(drivingUserPOCViewUpdateResponse);
    adapterDrivingUserPOCViewUpdate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewUpdate,
    );
    const drivingUserPOCViewUpdateSpy = vi.spyOn(
      drivingUserPOCViewUpdate,
      "execute",
    );

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCViewUpdateRequest.id}`,
      {
        body: JSON.stringify(
          objectPropertiesOmit(drivingUserPOCViewUpdateRequest, ["id"]),
        ),
        headers: [["Content-Type", "application/json"]],
        method: "PATCH",
      },
    );

    expect(drivingUserPOCViewUpdateSpy).toHaveBeenCalledWith(
      drivingUserPOCViewUpdateRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCViewUpdateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCViewUpdateResponse,
      true,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

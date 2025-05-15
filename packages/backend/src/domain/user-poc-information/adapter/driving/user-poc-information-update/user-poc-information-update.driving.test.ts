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
  PortDrivingUserPOCInformationUpdate,
  PortDrivingUserPOCInformationUpdateRequest,
  PortDrivingUserPOCInformationUpdateResponse,
} from "../../../application/port/driving/user-poc-information-update.ts";
import { adapterDrivingUserPOCInformationUpdate } from "./user-poc-information-update.driving.ts";

describe("UserPOCInformation Driving Update", () => {
  const updateMocks = (
    drivingUserPOCInformationUpdateResponse: PortDrivingUserPOCInformationUpdateResponse,
  ) => {
    const drivingUserPOCInformationUpdate =
      mock<PortDrivingUserPOCInformationUpdate>({
        execute: vi
          .fn()
          .mockResolvedValue(drivingUserPOCInformationUpdateResponse),
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
      drivingUserPOCInformationUpdate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingUserPOCInformationUpdateRequest: PortDrivingUserPOCInformationUpdateRequest =
      {
        address: faker.location.streetAddress(),
        age: faker.number.int(),
        id: faker.string.nanoid(24),
        userId: faker.string.nanoid(24),
      };
    const drivingUserPOCInformationUpdateResponse: PortDrivingUserPOCInformationUpdateResponse =
      {
        id: drivingUserPOCInformationUpdateRequest.id,
      };
    const {
      app,
      basePath,
      config,
      domainType,
      drivingUserPOCInformationUpdate,
      logger,
    } = updateMocks(drivingUserPOCInformationUpdateResponse);
    adapterDrivingUserPOCInformationUpdate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationUpdate,
    );
    const drivingUserPOCInformationUpdateSpy = vi.spyOn(
      drivingUserPOCInformationUpdate,
      "execute",
    );

    const response = await app.request(
      `${basePath}/${domainType}/${drivingUserPOCInformationUpdateRequest.id}`,
      {
        body: JSON.stringify(
          objectPropertiesOmit(drivingUserPOCInformationUpdateRequest, ["id"]),
        ),
        headers: [["Content-Type", "application/json"]],
        method: "PATCH",
      },
    );

    expect(drivingUserPOCInformationUpdateSpy).toHaveBeenCalledWith(
      drivingUserPOCInformationUpdateRequest,
    );
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse200(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingUserPOCInformationUpdateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      drivingUserPOCInformationUpdateResponse,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

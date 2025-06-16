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
  PortDrivingCSPCreate,
  PortDrivingCSPCreateRequest,
  PortDrivingCSPCreateResponse,
} from "../../../application/port/driving/csp-create.ts";
import { adapterDrivingCSPCreate } from "./csp-create.driving.ts";

describe("CSP Driving Create", () => {
  const createMocks = (
    drivingCSPCreateResponse: PortDrivingCSPCreateResponse,
  ) => {
    const drivingCSPCreate = mock<PortDrivingCSPCreate>({
      execute: vi.fn().mockResolvedValue(drivingCSPCreateResponse),
    });

    const app = new OpenAPIHono<Env>({ defaultHook });
    const basePath = "/api/v1";
    const config = mock<PortConfig>();
    const domainType = "csp";
    const logger = mock<PortLogger>();

    return {
      app,
      basePath,
      config,
      domainType,
      drivingCSPCreate,
      logger,
    };
  };

  it("should call post with correct data", async () => {
    expect.assertions(4);

    const drivingCSPCreateRequest: PortDrivingCSPCreateRequest = {
      "csp-report": {
        "blocked-uri": faker.internet.url(),
        disposition: faker.internet.url(),
        "document-uri": faker.internet.url(),
        "effective-directive": faker.internet.url(),
        "original-policy": faker.internet.url(),
        "script-sample": faker.internet.url(),
        referrer: faker.internet.url(),
        "status-code": faker.number.int(),
        "violated-directive": faker.internet.url(),
      },
    };
    const drivingCSPCreateResponse: PortDrivingCSPCreateResponse = {
      id: faker.string.nanoid(24),
      timestamp: new Date(),
    };
    const { app, basePath, config, domainType, drivingCSPCreate, logger } =
      createMocks(drivingCSPCreateResponse);
    adapterDrivingCSPCreate(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingCSPCreate,
    );
    const drivingCSPCreateSpy = vi.spyOn(drivingCSPCreate, "execute");

    const response = await app.request(`${basePath}/${domainType}`, {
      body: JSON.stringify(drivingCSPCreateRequest),
      headers: [["Content-Type", "application/json"]],
      method: "POST",
    });

    expect(drivingCSPCreateSpy).toHaveBeenCalledWith(drivingCSPCreateRequest);
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successResponse201(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingCSPCreateResponse.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      {
        ...drivingCSPCreateRequest,
        ...drivingCSPCreateResponse,
        timestamp: drivingCSPCreateResponse.timestamp.toISOString(),
      },
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(201);
  });
});

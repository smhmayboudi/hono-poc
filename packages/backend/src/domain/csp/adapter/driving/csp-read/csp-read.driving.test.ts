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
  PortDrivingCSPRead,
  PortDrivingCSPReadRequest,
  PortDrivingCSPReadResponse,
} from "../../../application/port/driving/csp-read.ts";
import { adapterDrivingCSPRead } from "./csp-read.driving.ts";

describe("CSP Driving Read", () => {
  const readMocks = (drivingCSPReadResponse: PortDrivingCSPReadResponse) => {
    const drivingCSPRead = mock<PortDrivingCSPRead>({
      execute: vi.fn().mockResolvedValue(drivingCSPReadResponse),
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
      drivingCSPRead,
      logger,
    };
  };

  it("should call get with correct data", async () => {
    expect.assertions(4);

    const drivingCSPReadRequest: PortDrivingCSPReadRequest = {
      limit: "0",
      offset: "0",
    };
    const data0 = {
      timestamp: faker.date.past(),
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
      id: faker.string.nanoid(24),
    };
    const drivingCSPReadResponse: PortDrivingCSPReadResponse = {
      data: [data0],
      pagination: { total: 1 },
    };
    const { app, basePath, config, domainType, drivingCSPRead, logger } =
      readMocks(drivingCSPReadResponse);
    adapterDrivingCSPRead(
      app,
      basePath,
      config,
      domainType,
      logger,
      drivingCSPRead,
    );
    const drivingCSPReadSpy = vi.spyOn(drivingCSPRead, "execute");

    const response = await app.request(`${basePath}/${domainType}`, {
      headers: [["Content-Type", "application/json"]],
      method: "GET",
    });

    expect(drivingCSPReadSpy).toHaveBeenCalledWith(drivingCSPReadRequest);
    expect(response).not.toBeNull();
    const expectedSuccessResponse = successArrayResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: `http://localhost${basePath}/${domainType}/${drivingCSPReadResponse[0]?.id}`,
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      basePath,
      domainType,
      {},
      [
        {
          ...data0,
          timestamp: data0.timestamp.toISOString(),
        },
      ],
      drivingCSPReadResponse.pagination,
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedSuccessResponse,
    );
    expect(response.status).toBe(200);
  });
});

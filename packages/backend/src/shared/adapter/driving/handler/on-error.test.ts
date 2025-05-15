import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../env.ts";
import { ErrorAuthForbidden } from "../../../../infrastructure/adapter/middleware/auth.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../default-hook.ts";
import { badRequestResponse } from "../response/bad-request.ts";
import { forbiddenResponse } from "../response/forbidden.ts";
import { internalServerErrorResponse } from "../response/internal-server-error.ts";
import { onErrorHandler } from "./on-error.ts";

describe("Driving Mobile Handler OnError", () => {
  const mocks = () => {
    const config = mock<PortConfig>();
    const logger = mock<PortLogger>({ assign: vi.fn(), error: vi.fn() });

    return {
      config,
      logger,
    };
  };

  it("should call onError", async () => {
    expect.assertions(3);

    const { config, logger } = mocks();
    const mockApp = new OpenAPIHono<Env>({ defaultHook });
    mockApp.onError(onErrorHandler(config, logger));
    mockApp.get("/onError", () => {
      throw new Error("onError");
    });

    const response = await mockApp.request("/onError");

    expect(response).not.toBeNull();
    expect(response.status).toBe(500);
    const expectedInternalServerErrorResponse = internalServerErrorResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: "http://localhost/onError",
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      "onError",
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedInternalServerErrorResponse,
    );
  });

  it("user onError first if", async () => {
    expect.assertions(3);

    const { config, logger } = mocks();
    const mockApp = new OpenAPIHono<Env>({ defaultHook });
    mockApp.onError(onErrorHandler(config, logger));
    mockApp.get("/onError", () => {
      throw new HTTPException(403, {
        message: "onError",
      });
    });

    const response = await mockApp.request("/onError");

    expect(response).not.toBeNull();
    expect(response.status).toBe(400);
    const expectedBadRequestResponse = badRequestResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: "http://localhost/onError",
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      "onError",
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedBadRequestResponse,
    );
  });

  it("user onError second if", async () => {
    expect.assertions(3);

    const { config, logger } = mocks();
    const mockApp = new OpenAPIHono<Env>({ defaultHook });
    mockApp.onError(onErrorHandler(config, logger));
    mockApp.get("/onError", () => {
      throw new ErrorAuthForbidden();
    });

    const response = await mockApp.request("/onError");

    expect(response).not.toBeNull();
    expect(response.status).toBe(403);
    const expectedForbiddenResponse = forbiddenResponse(
      {
        json: vi.fn((responseBody) => responseBody),
        req: {
          url: "http://localhost/onError",
        },
        status: vi.fn(),
      } as unknown as Context<Env>,
      "Forbidden",
    );
    await expect(response.json()).resolves.toStrictEqual(
      expectedForbiddenResponse,
    );
  });
});

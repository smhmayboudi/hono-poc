import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../env.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../default-hook.ts";
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

    const { config, logger } = await mocks();
    const mockApp = new OpenAPIHono<Env>({ defaultHook });
    mockApp.onError(onErrorHandler(config, logger));
    mockApp.get("/onError", () => {
      throw new Error("/onError");
    });

    const response = await mockApp.request("/onError");

    expect(response).not.toBeNull();
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toStrictEqual({
      errors: [
        {
          code: "INTERNAL_SERVER_ERROR",
          detail: "/onError",
          links: {
            about: "http://localhost/docs/errors/INTERNAL_SERVER_ERROR",
          },
          status: 500,
          title: "Internal Server Error",
        },
      ],
      jsonapi: {
        version: "1.0",
      },
    });
  });

  it("user onError first if", async () => {
    expect.assertions(3);

    const { config, logger } = await mocks();
    const mockApp = new OpenAPIHono<Env>({ defaultHook });
    mockApp.onError(onErrorHandler(config, logger));
    mockApp.get("/onError", () => {
      throw new HTTPException(401, {
        message: "401",
        cause: new Error("/onError"),
      });
    });

    const response = await mockApp.request("/onError");

    expect(response).not.toBeNull();
    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toStrictEqual("401");
  });
});

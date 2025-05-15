import { OpenAPIHono } from "@hono/zod-openapi";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { Env } from "../../../../env.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { defaultHook } from "../default-hook.ts";
import { notFoundHandler } from "./not-found.ts";

describe("Driving Mobile Handler NotFound", () => {
  const mocks = () => {
    const config = mock<PortConfig>();
    const logger = mock<PortLogger>({ assign: vi.fn(), error: vi.fn() });

    return {
      config,
      logger,
    };
  };

  it("should call notFound", async () => {
    expect.assertions(3);

    const { config, logger } = mocks();
    const mockApp = new OpenAPIHono<Env>({ defaultHook });
    mockApp.notFound(notFoundHandler(config, logger));

    const response = await mockApp.request("/notFound");

    expect(response).not.toBeNull();
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toStrictEqual({
      errors: [
        {
          code: "NOT_FOUND",
          detail: "Not found",
          links: {
            about: "http://localhost/page/doc/error/not-found",
          },
          status: 404,
          title: "Not Found",
        },
      ],
      jsonapi: {
        version: "1.0",
      },
    });
  });
});

import { OpenAPIHono } from "@hono/zod-openapi";
import { pino } from "pino";
import { describe, expect, it } from "vitest";

import type { Env } from "../../../env.ts";
import { loggerMiddleware, type LoggerOption } from "./logger.ts";

describe("Infrastructure Middleware RuntimeContext", () => {
  const appMock = (logHttpOpts?: LoggerOption["http"]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs: Record<string, any>[] = [];
    const app = new OpenAPIHono<Env>()
      .use(
        loggerMiddleware({
          pino: pino(
            { base: null, level: "trace", timestamp: false },
            {
              write: (data) => logs.push(JSON.parse(data)),
            },
          ),
          http: logHttpOpts ?? {},
        }),
      )
      .get("/", async (ctx) => ctx.text(""));

    return {
      logs,
      app,
    };
  };

  const defaultReqLog = {
    level: 20,
    msg: "Request received",
    req: {
      headers: {},
      method: "GET",
      url: "/",
    },
  };

  const defaultResLog = {
    ...defaultReqLog,
    msg: "Request completed",
    res: {
      headers: {},
      status: 200,
    },
  };

  describe("http logger", () => {
    it("full disable", async () => {
      expect.assertions(3);

      const { app, logs } = appMock(false);
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs.length).toBe(0);
    });

    it("full default", async () => {
      expect.assertions(5);

      const { app, logs } = appMock();
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1]).toMatchObject({
        ...defaultResLog,
        reqId: 1,
        responseTime: 0,
      });
    });

    it("disable reqId", async () => {
      expect.assertions(6);

      const { app, logs } = appMock({ reqId: false });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1] && logs[1]["reqId"]).toBeUndefined();
      expect(logs[1]).toMatchObject(defaultResLog);
    });

    it("custom reqId", async () => {
      expect.assertions(6);

      const { app, logs } = appMock({ reqId: () => "foo" });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1] && logs[1]["reqId"]).toBe("foo");
      expect(logs[1]).toMatchObject(defaultResLog);
    });
  });

  describe("on request", () => {
    it("basic", async () => {
      expect.assertions(5);

      const { app, logs } = appMock({
        onReqMessage: () => "Request received",
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject(defaultReqLog);
      expect(logs[1]).toMatchObject(defaultResLog);
    });

    it("custom log level", async () => {
      expect.assertions(5);

      const { app, logs } = appMock({
        onReqMessage: () => "Request received",
        onReqLevel: () => "debug",
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({ ...defaultReqLog, level: 20 });
      expect(logs[1]).toMatchObject(defaultResLog);
    });

    it("custom bindings", async () => {
      expect.assertions(6);

      const { app, logs } = appMock({
        onReqMessage: () => "Request received",
        onReqBindings: (ctx) => ({
          req: {
            foo: "bar",
            headers: ctx.req.header(),
            method: ctx.req.method,
            url: ctx.req.path,
          },
        }),
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]?.["req"]?.["foo"]).toBe("bar");
      expect(logs[0]).toMatchObject(defaultReqLog);
      expect(logs[1]).toMatchObject(defaultResLog);
    });
  });

  describe("on response", () => {
    it("custom log level", async () => {
      expect.assertions(5);

      const { app, logs } = appMock({
        onResLevel: () => "debug",
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1]).toMatchObject({ ...defaultResLog, level: 20 });
    });

    it("custom bindings", async () => {
      expect.assertions(6);

      const { app, logs } = appMock({
        onResBindings: (ctx) => ({
          res: {
            foo: "bar",
            headers: ctx.res.headers,
            status: ctx.res.status,
          },
        }),
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1]?.["res"]?.["foo"]).toBe("bar");
      expect(logs[1]).toMatchObject(defaultResLog);
    });

    it("custom message", async () => {
      expect.assertions(5);

      const { app, logs } = appMock({
        onResMessage: () => "foo",
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1]).toMatchObject({ ...defaultResLog, msg: "foo" });
    });
  });

  describe("response time", () => {
    it("basic", async () => {
      expect.assertions(5);

      const { app, logs } = appMock();
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1] && logs[1]["responseTime"]).toBeLessThan(1000);
    });

    it("disable", async () => {
      expect.assertions(5);

      const { app, logs } = appMock({
        responseTime: false,
      });
      const response = await app.request("/");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
      });
      expect(logs[1] && logs[1]["responseTime"]).toBeUndefined();
    });

    it("long time", async () => {
      expect.assertions(5);

      const { app, logs } = appMock();
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      app.get("/long-time", async (ctx) => {
        await sleep(1000);

        return ctx.text("");
      });
      const response = await app.request("/long-time");

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("");
      expect(logs).toHaveLength(2);
      expect(logs[0]).toMatchObject({
        ...defaultReqLog,
        msg: "Request received",
        req: {
          ...defaultReqLog.req,
          url: "/long-time",
        },
      });
      expect(logs[1] && logs[1]["responseTime"]).toBeGreaterThanOrEqual(1000);
    });
  });
});

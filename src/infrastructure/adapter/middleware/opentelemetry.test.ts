import { SpanKind, SpanStatusCode } from "@opentelemetry/api";
import {
  InMemorySpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { opentelemetryMiddleware } from "./opentelemetry.ts";

describe("OpenTelemetry middleware", () => {
  const app = new Hono();

  const memoryExporter = new InMemorySpanExporter();
  const spanProcessor = new SimpleSpanProcessor(memoryExporter);
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [spanProcessor],
  });

  const config = mock<PortConfig>({});
  const logger = mock<PortLogger>({});
  app.use(opentelemetryMiddleware(config, logger, tracerProvider));
  app.get("/ok", (ctx) => ctx.text("ok"));
  app.get("/error", () => {
    throw new Error("error message");
  });

  it("Should make a span", async () => {
    expect.assertions(5);
    memoryExporter.reset();
    await app.request("/ok");
    const spans = memoryExporter.getFinishedSpans();
    expect(spans.length).toBe(1);
    const [span] = spans;
    expect(span?.name).toBe("GET /ok");
    expect(span?.kind).toBe(SpanKind.SERVER);
    expect(span?.status.code).toBe(SpanStatusCode.OK);
    expect(span?.status.message).toBeUndefined();
  });

  it("Should make a span with error", async () => {
    expect.assertions(5);
    memoryExporter.reset();
    await app.request("/error");
    const spans = memoryExporter.getFinishedSpans();
    expect(spans.length).toBe(1);
    const [span] = spans;
    expect(span?.name).toBe("GET /error");
    expect(span?.kind).toBe(SpanKind.SERVER);
    expect(span?.status.code).toBe(SpanStatusCode.ERROR);
    expect(span?.status.message).toBe("error message");
  });
});

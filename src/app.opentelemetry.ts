import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { MySQL2Instrumentation } from "@opentelemetry/instrumentation-mysql2";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import {
  envDetectorSync,
  hostDetectorSync,
  processDetectorSync,
  Resource,
} from "@opentelemetry/resources";
import {
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import * as sentry from "@sentry/node";
import { SentryContextManager } from "@sentry/node";
import {
  SentryPropagator,
  SentrySampler,
  SentrySpanProcessor,
  setOpenTelemetryContextAsyncContextStrategy,
  setupEventContextTrace,
} from "@sentry/opentelemetry";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

sentry.init({
  debug:
    process.env["CI"] !== "true" && process.env["NODE_ENV"] !== "production",
  defaultIntegrations: false,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: Number(process.env["SENTRY_PROFILES_SAMPLE_RATE"] ?? 0),
  skipOpenTelemetrySetup: true,
});

const client = sentry.getClient();
if (!client) {
  throw new Error("Sentry client not initialized");
}

setupEventContextTrace(client);

const sdk = new NodeSDK({
  contextManager: new SentryContextManager(),
  instrumentations: [
    new HttpInstrumentation(),
    new MySQL2Instrumentation({ addSqlCommenterCommentToQueries: true }),
    new PinoInstrumentation(),
  ],
  logRecordProcessors: [
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "hono-poc",
    [ATTR_SERVICE_VERSION]: "0.0.0",
  }),
  resourceDetectors: [envDetectorSync, hostDetectorSync, processDetectorSync],
  sampler: new SentrySampler(client),
  spanProcessors: [new SentrySpanProcessor()],
  textMapPropagator: new SentryPropagator(),
  traceExporter: new ConsoleSpanExporter(),
});

setOpenTelemetryContextAsyncContextStrategy();

sdk.start();

process.on("SIGTERM", () => {
  if (
    process.env["CI"] === "true" ||
    process.env["NODE_ENV"] === "production"
  ) {
    sdk
      .shutdown()
      .then(() => console.log("tracing terminated"))
      .catch((error) => console.error("error terminating tracing", error));
  }
});

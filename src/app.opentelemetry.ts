import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { MySQL2Instrumentation } from "@opentelemetry/instrumentation-mysql2";
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis-4";
import {
  envDetector,
  hostDetector,
  processDetector,
  Resource,
} from "@opentelemetry/resources";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import Pyroscope from "@pyroscope/nodejs";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const otlpTraceExporter = new OTLPTraceExporter();
const sdk = new NodeSDK({
  autoDetectResources: false,
  contextManager: new AsyncLocalStorageContextManager(),
  // idGenerator: IdGenerator;
  instrumentations: [
    new HttpInstrumentation(),
    new MySQL2Instrumentation(),
    new RedisInstrumentation(),
  ],
  logRecordProcessors: [new SimpleLogRecordProcessor(new OTLPLogExporter())],
  mergeResourceWithDefaults: false,
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "hono-poc",
    [ATTR_SERVICE_VERSION]: "0.0.0",
  }),
  resourceDetectors: [envDetector, hostDetector, processDetector],
  // sampler: Sampler;
  // spanLimits: SpanLimits;
  serviceName: "server",
  spanProcessors: [new SimpleSpanProcessor(otlpTraceExporter)],
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
  traceExporter: otlpTraceExporter,
  // views: View[];
});

sdk.start();

(async () => {
  Pyroscope.init({
    appName: "hono-poc",
    serverAddress: "http://127.0.0.1:4040",
    sourceMapper: await Pyroscope.SourceMapper.create(["."], true),
  });
  Pyroscope.startCpuProfiling();
  Pyroscope.startHeapProfiling();
  Pyroscope.startWallProfiling();
})();

process.on("SIGTERM", () => {
  if (
    process.env["CI"] === "true" ||
    process.env["NODE_ENV"] === "production"
  ) {
    Pyroscope.stopCpuProfiling();
    Pyroscope.stopHeapProfiling();
    Pyroscope.stopWallProfiling();
    sdk
      .shutdown()
      .then(() => console.log("tracing terminated"))
      .catch((error) => console.error("error terminating tracing", error));
  }
});

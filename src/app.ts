import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { pino } from "pino";

import { appEventEmitter } from "./app.event-emitter.ts";
import { swagger } from "./app.swagger.ts";
import { userPOC } from "./domain/user-poc/user-poc.ts";
import { userPOCInformation } from "./domain/user-poc-information/user-poc-information.ts";
import { userPOCView } from "./domain/user-poc-view/user-poc-view.ts";
import type { Env } from "./env.ts";
import { auth } from "./infrastructure/adapter/auth/auth.ts";
import { cacher } from "./infrastructure/adapter/cacher/cacher.ts";
import { config } from "./infrastructure/adapter/config/config.ts";
import { database } from "./infrastructure/adapter/database/database.ts";
import { elasticsearch } from "./infrastructure/adapter/elasticsearch/elasticsearch.ts";
import { eventEmitter } from "./infrastructure/adapter/event-emitter/event-emitter.ts";
import { generate } from "./infrastructure/adapter/generate/generate.ts";
import { Logger } from "./infrastructure/adapter/logger/logger.ts";
import { authMiddleware } from "./infrastructure/adapter/middleware/auth.ts";
import { loggerMiddleware } from "./infrastructure/adapter/middleware/logger.ts";
import { opentelemetryMiddleware } from "./infrastructure/adapter/middleware/opentelemetry.ts";
import { tracer } from "./infrastructure/adapter/opentelemetry/opentelemetry.ts";
import { defaultHook } from "./shared/adapter/driving/default-hook.ts";
import { notFoundHandler } from "./shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "./shared/adapter/driving/handler/on-error.ts";

const level = "trace";
const basePath = "/api/v1";
const authPath = `${basePath}/auth`;
const healthyPath = `${basePath}/healthy`;
const swaggerPath = `${basePath}/reference`;

const config2 = config(tracer);
const cacher2 = cacher(config2, new Logger(pino({ level })), tracer);
const database2 = database(config2, new Logger(pino({ level })), tracer);
const auth2 = auth(
  basePath,
  cacher2,
  config2,
  database2,
  [authPath, healthyPath, swaggerPath],
  new Logger(pino({ level })),
  new Logger(pino({ level })),
  new Logger(pino({ level })),
  new Logger(pino({ level })),
  tracer,
);
const elasticsearch2 = elasticsearch(
  config2,
  new Logger(pino({ level })),
  tracer,
);
const eventEmitter2 = eventEmitter(
  config2,
  new Logger(pino({ level })),
  tracer,
);
const generate2 = generate(tracer);

appEventEmitter(cacher2, database2, elasticsearch2, eventEmitter2);

const app = new OpenAPIHono<Env>({ defaultHook });

app.use(
  opentelemetryMiddleware(config2, new Logger(pino({ level }))),
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "OPTIONS", "POST"],
    credentials: true,
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    origin: ["http://127.0.0.1:8081", "http://localhost:8081"],
  }),
  csrf({
    origin: (origin) =>
      ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
  }),
  loggerMiddleware(config2, { pino: new Logger(pino({ level })) }),
  authMiddleware(
    auth2,
    basePath,
    config2,
    [authPath, healthyPath, swaggerPath],
    new Logger(pino({ level })),
  ),
);

app.on(["POST", "GET"], `${authPath}/*`, (ctx) => auth2.handler(ctx.req.raw));

// /health/liveness, /health/readiness
app.get(healthyPath, (ctx) => ctx.text(""));

const { useCaseUserPOCCreate, useCaseUserPOCDelete, useCaseUserPOCUpdate } =
  userPOC(
    app,
    basePath,
    config2,
    database2,
    "user-poc",
    eventEmitter2,
    generate2,
    new Logger(pino({ level })),
    tracer,
  );
const {
  useCaseUserPOCInformationCreate,
  useCaseUserPOCInformationDeleteUserID,
  useCaseUserPOCInformationUpdateUserID,
} = userPOCInformation(
  app,
  basePath,
  config2,
  database2,
  "user-poc-information",
  eventEmitter2,
  generate2,
  new Logger(pino({ level })),
  tracer,
);
userPOCView(
  app,
  basePath,
  cacher2,
  config2,
  database2,
  "user-poc-view",
  useCaseUserPOCCreate,
  useCaseUserPOCDelete,
  useCaseUserPOCUpdate,
  useCaseUserPOCInformationCreate,
  useCaseUserPOCInformationDeleteUserID,
  useCaseUserPOCInformationUpdateUserID,
  elasticsearch2,
  eventEmitter2,
  new Logger(pino({ level })),
  tracer,
);

swagger(app, swaggerPath);

app.notFound(notFoundHandler(config2, new Logger(pino({ level }))));
app.onError(onErrorHandler(config2, new Logger(pino({ level }))));

export default {
  fetch: app.fetch,
  logger: new Logger(pino({ level })),
  port: config2.server().server().port(),
};

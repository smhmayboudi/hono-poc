import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { pino } from "pino";

import { appEventEmitter } from "./app.event-emitter.ts";
import { page } from "./app.page.tsx";
import { swagger } from "./app.swagger.ts";
import { csp } from "./domain/csp/csp.ts";
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
import { time } from "./infrastructure/adapter/time/time.ts";
import { defaultHook } from "./shared/adapter/driving/default-hook.ts";
import { notFoundHandler } from "./shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "./shared/adapter/driving/handler/on-error.ts";

const level = "trace";
const basePath = "/api/v1";
const authPath = `${basePath}/auth`;
const cspPath = `${basePath}/csp`;
const healthyPath = `${basePath}/healthy`;
const k6TestPath = `${basePath}/user-poc-view`;
const pagePath = "/page";
const swaggerPath = `${basePath}/reference`;

const config2 = config(tracer);
const cacher2 = cacher(config2, new Logger(pino({ level })), tracer);
const database2 = database(config2, new Logger(pino({ level })), tracer);
const auth2 = auth(
  basePath,
  cacher2,
  config2,
  database2,
  [authPath, cspPath, healthyPath, k6TestPath, pagePath, swaggerPath],
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
const time2 = time(tracer);

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
    origin: [
      "http://127.0.0.1:5173",
      "http://127.0.0.1:8081",
      "http://localhost:5173",
      "http://localhost:8081",
    ],
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
    [authPath, cspPath, healthyPath, k6TestPath, pagePath, swaggerPath],
    new Logger(pino({ level })),
  ),
);

app.on(["POST", "GET"], `${authPath}/*`, (ctx) => auth2.handler(ctx.req.raw));

// /health/liveness, /health/readiness
app.get(healthyPath, (ctx) => ctx.text(""));

const { adapterDrivingCSPCreateRoute, adapterDrivingCSPReadRoute } = csp(
  app,
  basePath,
  config2,
  database2,
  "csp",
  eventEmitter2,
  generate2,
  new Logger(pino({ level })),
  time2,
  tracer,
);

export const {
  adapterDrivingUserPOCCreateRoute,
  adapterDrivingUserPOCDeleteRoute,
  adapterDrivingUserPOCReadIDRoute,
  adapterDrivingUserPOCReadRoute,
  adapterDrivingUserPOCUpdateRoute,
  useCaseUserPOCCreate,
  useCaseUserPOCDelete,
  useCaseUserPOCUpdate,
} = userPOC(
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
export const {
  adapterDrivingUserPOCInformationCreateRoute,
  adapterDrivingUserPOCInformationDeleteRoute,
  adapterDrivingUserPOCInformationReadIDRoute,
  adapterDrivingUserPOCInformationReadRoute,
  adapterDrivingUserPOCInformationUpdateRoute,
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
export const {
  adapterDrivingUserPOCViewCreateRoute,
  adapterDrivingUserPOCViewDeleteRoute,
  adapterDrivingUserPOCViewReadIDRoute,
  adapterDrivingUserPOCViewReadRoute,
  adapterDrivingUserPOCViewSearchRoute,
  adapterDrivingUserPOCViewUpdateRoute,
} = userPOCView(
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
page(app, pagePath);

app.notFound(notFoundHandler(config2, new Logger(pino({ level }))));
app.onError(onErrorHandler(config2, new Logger(pino({ level }))));

export default {
  fetch: app.fetch,
  logger: new Logger(pino({ level })),
  port: config2.server().server().port(),
};

export type AppType =
  | typeof adapterDrivingCSPCreateRoute
  | typeof adapterDrivingCSPReadRoute
  | typeof adapterDrivingUserPOCCreateRoute
  | typeof adapterDrivingUserPOCDeleteRoute
  | typeof adapterDrivingUserPOCReadIDRoute
  | typeof adapterDrivingUserPOCReadRoute
  | typeof adapterDrivingUserPOCUpdateRoute
  | typeof adapterDrivingUserPOCInformationCreateRoute
  | typeof adapterDrivingUserPOCInformationDeleteRoute
  | typeof adapterDrivingUserPOCInformationReadIDRoute
  | typeof adapterDrivingUserPOCInformationReadRoute
  | typeof adapterDrivingUserPOCInformationUpdateRoute
  | typeof adapterDrivingUserPOCViewCreateRoute
  | typeof adapterDrivingUserPOCViewDeleteRoute
  | typeof adapterDrivingUserPOCViewReadIDRoute
  | typeof adapterDrivingUserPOCViewReadRoute
  | typeof adapterDrivingUserPOCViewSearchRoute
  | typeof adapterDrivingUserPOCViewUpdateRoute;

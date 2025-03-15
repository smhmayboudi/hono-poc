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
import { casbin } from "./infrastructure/adapter/casbin/casbin.ts";
import { config } from "./infrastructure/adapter/config/config.ts";
import { database } from "./infrastructure/adapter/database/database.ts";
import { elasticsearch } from "./infrastructure/adapter/elasticsearch/elasticsearch.ts";
import { eventEmitter } from "./infrastructure/adapter/event-emitter/event-emitter.ts";
import { generate } from "./infrastructure/adapter/generate/generate.ts";
import { Logger } from "./infrastructure/adapter/logger/logger.ts";
import { casbinMiddleware } from "./infrastructure/adapter/middleware/casbin.ts";
import { loggerMiddleware } from "./infrastructure/adapter/middleware/logger.ts";
import { opentelemetryMiddleware } from "./infrastructure/adapter/middleware/opentelemetry.ts";
import { defaultHook } from "./shared/adapter/driving/default-hook.ts";
import { notFoundHandler } from "./shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "./shared/adapter/driving/handler/on-error.ts";

const level = "trace";
const basePath = "/api/v1";
const eventEmitter2 = eventEmitter(config, new Logger(pino({ level })));
const elasticsearch2 = elasticsearch(config, new Logger(pino({ level })));
const database2 = database(config, new Logger(pino({ level })));
const cacher2 = cacher(config, new Logger(pino({ level })));
const auth2 = auth(config, database2, new Logger(pino({ level })));

appEventEmitter(cacher2, database2, elasticsearch2, eventEmitter2);

const app = new OpenAPIHono<Env>({ defaultHook });

app.use(
  opentelemetryMiddleware(config, new Logger(pino({ level }))),
  cors(),
  csrf({
    origin: (origin) =>
      ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
  }),
  loggerMiddleware({ http: false, pino: new Logger(pino({ level })) }),
  casbinMiddleware(
    casbin(auth2, config, new Logger(pino({ level }))),
    config,
    new Logger(pino({ level })),
  ),
);

app.on(["POST", "GET"], "/api/v1/auth/**", (ctx) => auth2.handler(ctx.req.raw));

// /health/liveness, /health/readiness
app.get(`${basePath}/healthy`, (ctx) => ctx.text(""));

const { useCaseUserPOCCreate, useCaseUserPOCDelete, useCaseUserPOCUpdate } =
  userPOC(
    app,
    basePath,
    config,
    database2,
    "user-poc",
    eventEmitter2,
    generate,
    new Logger(pino({ level })),
  );
const {
  useCaseUserPOCInformationCreate,
  useCaseUserPOCInformationDeleteUserID,
  useCaseUserPOCInformationUpdateUserID,
} = userPOCInformation(
  app,
  basePath,
  config,
  database2,
  "user-poc-information",
  eventEmitter2,
  generate,
  new Logger(pino({ level })),
);
userPOCView(
  app,
  basePath,
  cacher2,
  config,
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
);

swagger(app, basePath);

app.notFound(notFoundHandler(config, new Logger(pino({ level }))));
app.onError(onErrorHandler(config, new Logger(pino({ level }))));

export default {
  fetch: app.fetch,
  logger: new Logger(pino({ level })),
  port: config.server().port(),
};

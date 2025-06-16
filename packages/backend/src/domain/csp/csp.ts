import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../env.ts";
import type { PortConfig } from "../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../infrastructure/application/port/database/database.ts";
import type { PortEventEmitter } from "../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortTime } from "../../infrastructure/application/port/time/time.ts";
import { AdapterDrivenCSPCreate } from "./adapter/driven/csp-create.ts";
import { AdapterDrivenCSPRead } from "./adapter/driven/csp-read.ts";
import { adapterDrivingCSPCreate } from "./adapter/driving/csp-create/csp-create.driving.ts";
import { adapterDrivingCSPRead } from "./adapter/driving/csp-read/csp-read.driving.ts";
import { UseCaseCSPCreate } from "./application/use-case/csp-create.ts";
import { UseCaseCSPRead } from "./application/use-case/csp-read.ts";

export const csp = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  database: PortDatabase,
  domainType: string,
  eventEmitter: PortEventEmitter,
  generate: PortGenerate,
  logger: PortLogger,
  time: PortTime,
  tracer: PortTracer,
) => {
  const adapterDrivenCSPCreate = new AdapterDrivenCSPCreate(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseCSPCreate = new UseCaseCSPCreate(
    config,
    adapterDrivenCSPCreate,
    eventEmitter,
    generate,
    logger,
    time,
    tracer,
  );
  const adapterDrivingCSPCreateRoute = adapterDrivingCSPCreate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseCSPCreate,
  );
  const adapterDrivenCSPRead = new AdapterDrivenCSPRead(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseCSPRead = new UseCaseCSPRead(
    config,
    adapterDrivenCSPRead,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingCSPReadRoute = adapterDrivingCSPRead(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseCSPRead,
  );

  return {
    adapterDrivingCSPCreateRoute,
    adapterDrivingCSPReadRoute,
    useCaseCSPCreate,
    useCaseCSPRead,
  };
};

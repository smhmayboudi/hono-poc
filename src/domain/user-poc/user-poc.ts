import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../env.ts";
import type { PortConfig } from "../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../infrastructure/application/port/database/database.ts";
import type { PortEventEmitter } from "../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import { AdapterDrivenUserPOCCreate } from "./adapter/driven/user-poc-create.ts";
import { AdapterDrivenUserPOCDelete } from "./adapter/driven/user-poc-delete.ts";
import { AdapterDrivenUserPOCRead } from "./adapter/driven/user-poc-read.ts";
import { AdapterDrivenUserPOCReadID } from "./adapter/driven/user-poc-read-id.ts";
import { AdapterDrivenUserPOCUpdate } from "./adapter/driven/user-poc-update.ts";
import { adapterDrivingUserPOCCreate } from "./adapter/driving/user-poc-create/user-poc-create.driving.ts";
import { adapterDrivingUserPOCDelete } from "./adapter/driving/user-poc-delete/user-poc-delete.driving.ts";
import { adapterDrivingUserPOCRead } from "./adapter/driving/user-poc-read/user-poc-read.driving.ts";
import { adapterDrivingUserPOCReadID } from "./adapter/driving/user-poc-read-id/user-poc-read-id.driving.ts";
import { adapterDrivingUserPOCUpdate } from "./adapter/driving/user-poc-update/user-poc-update.driving.ts";
import { UseCaseUserPOCCreate } from "./application/use-case/user-poc-create.ts";
import { UseCaseUserPOCDelete } from "./application/use-case/user-poc-delete.ts";
import { UseCaseUserPOCRead } from "./application/use-case/user-poc-read.ts";
import { UseCaseUserPOCReadID } from "./application/use-case/user-poc-read-id.ts";
import { UseCaseUserPOCUpdate } from "./application/use-case/user-poc-update.ts";

export const userPOC = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  database: PortDatabase,
  domainType: string,
  eventEmitter: PortEventEmitter,
  generate: PortGenerate,
  logger: PortLogger,
  tracer: PortTracer,
) => {
  const adapterDrivenUserPOCCreate = new AdapterDrivenUserPOCCreate(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseUserPOCCreate = new UseCaseUserPOCCreate(
    config,
    adapterDrivenUserPOCCreate,
    eventEmitter,
    generate,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCCreateRoute = adapterDrivingUserPOCCreate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCCreate,
  );
  const adapterDrivenUserPOCDelete = new AdapterDrivenUserPOCDelete(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseUserPOCDelete = new UseCaseUserPOCDelete(
    config,
    adapterDrivenUserPOCDelete,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCDeleteRoute = adapterDrivingUserPOCDelete(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCDelete,
  );
  const adapterDrivenUserPOCRead = new AdapterDrivenUserPOCRead(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseUserPOCRead = new UseCaseUserPOCRead(
    config,
    adapterDrivenUserPOCRead,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCReadRoute = adapterDrivingUserPOCRead(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCRead,
  );
  const adapterDrivenUserPOCReadID = new AdapterDrivenUserPOCReadID(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseUserPOCReadID = new UseCaseUserPOCReadID(
    config,
    adapterDrivenUserPOCReadID,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCReadIDRoute = adapterDrivingUserPOCReadID(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCReadID,
  );
  const adapterDrivenUserPOCUpdate = new AdapterDrivenUserPOCUpdate(
    config,
    database,
    logger,
    tracer,
  );
  const useCaseUserPOCUpdate = new UseCaseUserPOCUpdate(
    config,
    adapterDrivenUserPOCUpdate,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCUpdateRoute = adapterDrivingUserPOCUpdate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCUpdate,
  );

  return {
    adapterDrivingUserPOCCreateRoute,
    adapterDrivingUserPOCDeleteRoute,
    adapterDrivingUserPOCReadIDRoute,
    adapterDrivingUserPOCReadRoute,
    adapterDrivingUserPOCUpdateRoute,
    useCaseUserPOCCreate,
    useCaseUserPOCDelete,
    useCaseUserPOCRead,
    useCaseUserPOCReadID,
    useCaseUserPOCUpdate,
  };
};

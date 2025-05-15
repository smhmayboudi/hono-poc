import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../env.ts";
import type { PortConfig } from "../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../infrastructure/application/port/database/database.ts";
import type { PortEventEmitter } from "../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import { AdapterDrivenUserPOCInformationCreate } from "./adapter/driven/user-poc-information-create.ts";
import { AdapterDrivenUserPOCInformationDelete } from "./adapter/driven/user-poc-information-delete.ts";
import { AdapterDrivenUserPOCInformationDeleteUserID } from "./adapter/driven/user-poc-information-delete-user-id.ts";
import { AdapterDrivenUserPOCInformationRead } from "./adapter/driven/user-poc-information-read.ts";
import { AdapterDrivenUserPOCInformationReadID } from "./adapter/driven/user-poc-information-read-id.ts";
import { AdapterDrivenUserPOCInformationUpdate } from "./adapter/driven/user-poc-information-update.ts";
import { AdapterDrivenUserPOCInformationUpdateUserID } from "./adapter/driven/user-poc-information-update-user-id.ts";
import { adapterDrivingUserPOCInformationCreate } from "./adapter/driving/user-poc-information-create/user-poc-information-create.driving.ts";
import { adapterDrivingUserPOCInformationDelete } from "./adapter/driving/user-poc-information-delete/user-poc-information-delete.driving.ts";
import { adapterDrivingUserPOCInformationRead } from "./adapter/driving/user-poc-information-read/user-poc-information-read.driving.ts";
import { adapterDrivingUserPOCInformationReadID } from "./adapter/driving/user-poc-information-read-id/user-poc-information-read-id.driving.ts";
import { adapterDrivingUserPOCInformationUpdate } from "./adapter/driving/user-poc-information-update/user-poc-information-update.driving.ts";
import { UseCaseUserPOCInformationCreate } from "./application/use-case/user-poc-information-create.ts";
import { UseCaseUserPOCInformationDelete } from "./application/use-case/user-poc-information-delete.ts";
import { UseCaseUserPOCInformationDeleteUserID } from "./application/use-case/user-poc-information-delete-user-id.ts";
import { UseCaseUserPOCInformationRead } from "./application/use-case/user-poc-information-read.ts";
import { UseCaseUserPOCInformationReadID } from "./application/use-case/user-poc-information-read-id.ts";
import { UseCaseUserPOCInformationUpdate } from "./application/use-case/user-poc-information-update.ts";
import { UseCaseUserPOCInformationUpdateUserID } from "./application/use-case/user-poc-information-update-user-id.ts";

export const userPOCInformation = (
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
  const adapterDrivenUserPOCInformationCreate =
    new AdapterDrivenUserPOCInformationCreate(config, database, logger, tracer);
  const useCaseUserPOCInformationCreate = new UseCaseUserPOCInformationCreate(
    config,
    adapterDrivenUserPOCInformationCreate,
    eventEmitter,
    generate,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCInformationCreateRoute =
    adapterDrivingUserPOCInformationCreate(
      app,
      basePath,
      config,
      domainType,
      logger,
      useCaseUserPOCInformationCreate,
    );
  const adapterDrivenUserPOCInformationDelete =
    new AdapterDrivenUserPOCInformationDelete(config, database, logger, tracer);
  const useCaseUserPOCInformationDelete = new UseCaseUserPOCInformationDelete(
    config,
    adapterDrivenUserPOCInformationDelete,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCInformationDeleteRoute =
    adapterDrivingUserPOCInformationDelete(
      app,
      basePath,
      config,
      domainType,
      logger,
      useCaseUserPOCInformationDelete,
    );
  const adapterDrivenUserPOCInformationDeleteUserID =
    new AdapterDrivenUserPOCInformationDeleteUserID(
      config,
      database,
      logger,
      tracer,
    );
  const useCaseUserPOCInformationDeleteUserID =
    new UseCaseUserPOCInformationDeleteUserID(
      config,
      adapterDrivenUserPOCInformationDeleteUserID,
      eventEmitter,
      logger,
      tracer,
    );
  const adapterDrivenUserPOCInformationRead =
    new AdapterDrivenUserPOCInformationRead(config, database, logger, tracer);
  const useCaseUserPOCInformationRead = new UseCaseUserPOCInformationRead(
    config,
    adapterDrivenUserPOCInformationRead,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCInformationReadRoute =
    adapterDrivingUserPOCInformationRead(
      app,
      basePath,
      config,
      domainType,
      logger,
      useCaseUserPOCInformationRead,
    );
  const adapterDrivenUserPOCInformationReadID =
    new AdapterDrivenUserPOCInformationReadID(config, database, logger, tracer);
  const useCaseUserPOCInformationReadID = new UseCaseUserPOCInformationReadID(
    config,
    adapterDrivenUserPOCInformationReadID,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCInformationReadIDRoute =
    adapterDrivingUserPOCInformationReadID(
      app,
      basePath,
      config,
      domainType,
      logger,
      useCaseUserPOCInformationReadID,
    );
  const adapterDrivenUserPOCInformationUpdate =
    new AdapterDrivenUserPOCInformationUpdate(config, database, logger, tracer);
  const useCaseUserPOCInformationUpdate = new UseCaseUserPOCInformationUpdate(
    config,
    adapterDrivenUserPOCInformationUpdate,
    eventEmitter,
    logger,
    tracer,
  );
  const adapterDrivingUserPOCInformationUpdateRoute =
    adapterDrivingUserPOCInformationUpdate(
      app,
      basePath,
      config,
      domainType,
      logger,

      useCaseUserPOCInformationUpdate,
    );
  const adapterDrivenUserPOCInformationUpdateUserID =
    new AdapterDrivenUserPOCInformationUpdateUserID(
      config,
      database,
      logger,
      tracer,
    );
  const useCaseUserPOCInformationUpdateUserID =
    new UseCaseUserPOCInformationUpdateUserID(
      config,
      adapterDrivenUserPOCInformationUpdateUserID,
      eventEmitter,
      logger,
      tracer,
    );

  return {
    adapterDrivingUserPOCInformationCreateRoute,
    adapterDrivingUserPOCInformationDeleteRoute,
    adapterDrivingUserPOCInformationReadIDRoute,
    adapterDrivingUserPOCInformationReadRoute,
    adapterDrivingUserPOCInformationUpdateRoute,
    useCaseUserPOCInformationCreate,
    useCaseUserPOCInformationDelete,
    useCaseUserPOCInformationDeleteUserID,
    useCaseUserPOCInformationRead,
    useCaseUserPOCInformationReadID,
    useCaseUserPOCInformationUpdate,
    useCaseUserPOCInformationUpdateUserID,
  };
};

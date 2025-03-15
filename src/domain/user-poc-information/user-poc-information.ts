import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../env.ts";
import type { PortConfig } from "../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../infrastructure/application/port/database/database.ts";
import type { PortEventEmitter } from "../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../infrastructure/application/port/logger/logger.ts";
import { AdapterDrivenUserPOCInformationCreate } from "./adapter/driven/user-poc-information-create.ts";
import { AdapterDrivenUserPOCInformationDelete } from "./adapter/driven/user-poc-information-delete.ts";
import { AdapterDrivenUserPOCInformationDeleteUserId } from "./adapter/driven/user-poc-information-delete-user-id.ts";
import { AdapterDrivenUserPOCInformationRead } from "./adapter/driven/user-poc-information-read.ts";
import { AdapterDrivenUserPOCInformationReadID } from "./adapter/driven/user-poc-information-read-id.ts";
import { AdapterDrivenUserPOCInformationUpdate } from "./adapter/driven/user-poc-information-update.ts";
import { AdapterDrivenUserPOCInformationUpdateUserId } from "./adapter/driven/user-poc-information-update-user-id.ts";
import { adapterDrivingUserPOCInformationCreate } from "./adapter/driving/user-poc-information-create/user-poc-information-create.driving.ts";
import { adapterDrivingUserPOCInformationDelete } from "./adapter/driving/user-poc-information-delete/user-poc-information-delete.driving.ts";
import { adapterDrivingUserPOCInformationRead } from "./adapter/driving/user-poc-information-read/user-poc-information-read.driving.ts";
import { adapterDrivingUserPOCInformationReadID } from "./adapter/driving/user-poc-information-read-id/user-poc-information-read-id.driving.ts";
import { adapterDrivingUserPOCInformationUpdate } from "./adapter/driving/user-poc-information-update/user-poc-information-update.driving.ts";
import { UseCaseUserPOCInformationCreate } from "./application/use-case/user-poc-information-create.ts";
import { UseCaseUserPOCInformationDelete } from "./application/use-case/user-poc-information-delete.ts";
import { UseCaseUserPOCInformationDeleteUserId } from "./application/use-case/user-poc-information-delete-user-id.ts";
import { UseCaseUserPOCInformationRead } from "./application/use-case/user-poc-information-read.ts";
import { UseCaseUserPOCInformationReadID } from "./application/use-case/user-poc-information-read-id.ts";
import { UseCaseUserPOCInformationUpdate } from "./application/use-case/user-poc-information-update.ts";
import { UseCaseUserPOCInformationUpdateUserId } from "./application/use-case/user-poc-information-update-user-id.ts";

export const userPOCInformation = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  database: PortDatabase,
  domainType: string,
  eventEmitter: PortEventEmitter,
  generate: PortGenerate,
  logger: PortLogger,
) => {
  const adapterDrivenUserPOCInformationCreate =
    new AdapterDrivenUserPOCInformationCreate(config, database, logger);
  const useCaseUserPOCInformationCreate = new UseCaseUserPOCInformationCreate(
    config,
    adapterDrivenUserPOCInformationCreate,
    eventEmitter,
    generate,
    logger,
  );
  adapterDrivingUserPOCInformationCreate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCInformationCreate,
  );
  const adapterDrivenUserPOCInformationDelete =
    new AdapterDrivenUserPOCInformationDelete(config, database, logger);
  const useCaseUserPOCInformationDelete = new UseCaseUserPOCInformationDelete(
    config,
    adapterDrivenUserPOCInformationDelete,
    eventEmitter,
    logger,
  );
  adapterDrivingUserPOCInformationDelete(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCInformationDelete,
  );
  const adapterDrivenUserPOCInformationDeleteUserId =
    new AdapterDrivenUserPOCInformationDeleteUserId(config, database, logger);
  const useCaseUserPOCInformationDeleteUserId =
    new UseCaseUserPOCInformationDeleteUserId(
      config,
      adapterDrivenUserPOCInformationDeleteUserId,
      eventEmitter,
      logger,
    );
  const adapterDrivenUserPOCInformationRead =
    new AdapterDrivenUserPOCInformationRead(config, database, logger);
  const useCaseUserPOCInformationRead = new UseCaseUserPOCInformationRead(
    config,
    adapterDrivenUserPOCInformationRead,
    eventEmitter,
    logger,
  );
  adapterDrivingUserPOCInformationRead(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCInformationRead,
  );
  const adapterDrivenUserPOCInformationReadID =
    new AdapterDrivenUserPOCInformationReadID(config, database, logger);
  const useCaseUserPOCInformationReadID = new UseCaseUserPOCInformationReadID(
    config,
    adapterDrivenUserPOCInformationReadID,
    eventEmitter,
    logger,
  );
  adapterDrivingUserPOCInformationReadID(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCInformationReadID,
  );
  const adapterDrivenUserPOCInformationUpdate =
    new AdapterDrivenUserPOCInformationUpdate(config, database, logger);
  const useCaseUserPOCInformationUpdate = new UseCaseUserPOCInformationUpdate(
    config,
    adapterDrivenUserPOCInformationUpdate,
    eventEmitter,
    logger,
  );
  adapterDrivingUserPOCInformationUpdate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCInformationUpdate,
  );
  const adapterDrivenUserPOCInformationUpdateUserId =
    new AdapterDrivenUserPOCInformationUpdateUserId(config, database, logger);
  const useCaseUserPOCInformationUpdateUserId =
    new UseCaseUserPOCInformationUpdateUserId(
      config,
      adapterDrivenUserPOCInformationUpdateUserId,
      eventEmitter,
      logger,
    );

  return {
    useCaseUserPOCInformationCreate,
    useCaseUserPOCInformationDelete,
    useCaseUserPOCInformationDeleteUserId,
    useCaseUserPOCInformationRead,
    useCaseUserPOCInformationReadID,
    useCaseUserPOCInformationUpdate,
    useCaseUserPOCInformationUpdateUserId,
  };
};

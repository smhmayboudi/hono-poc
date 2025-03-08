import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../env.ts";
import type { PortConfig } from "../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../infrastructure/application/port/database/database.ts";
import type { PortGenerate } from "../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../infrastructure/application/port/logger/logger.ts";
import { AdapterDrivenUserPOCInformationCreate } from "./adapter/driven/user-poc-information-create.ts";
import { AdapterDrivenUserPOCInformationDelete } from "./adapter/driven/user-poc-information-delete.ts";
import { AdapterDrivenUserPOCInformationRead } from "./adapter/driven/user-poc-information-read.ts";
import { AdapterDrivenUserPOCInformationReadID } from "./adapter/driven/user-poc-information-read-id.ts";
import { AdapterDrivenUserPOCInformationUpdate } from "./adapter/driven/user-poc-information-update.ts";
import { adapterDrivingUserPOCInformationCreate } from "./adapter/driving/user-poc-information-create/user-poc-information-create.driving.ts";
import { adapterDrivingUserPOCInformationDelete } from "./adapter/driving/user-poc-information-delete/user-poc-information-delete.driving.ts";
import { adapterDrivingUserPOCInformationRead } from "./adapter/driving/user-poc-information-read/user-poc-information-read.driving.ts";
import { adapterDrivingUserPOCInformationReadID } from "./adapter/driving/user-poc-information-read-id/user-poc-information-read-id.driving.ts";
import { adapterDrivingUserPOCInformationUpdate } from "./adapter/driving/user-poc-information-update/user-poc-information-update.driving.ts";
import { UseCaseUserPOCInformationCreate } from "./application/use-case/user-poc-information-create.ts";
import { UseCaseUserPOCInformationDelete } from "./application/use-case/user-poc-information-delete.ts";
import { UseCaseUserPOCInformationRead } from "./application/use-case/user-poc-information-read.ts";
import { UseCaseUserPOCInformationReadID } from "./application/use-case/user-poc-information-read-id.ts";
import { UseCaseUserPOCInformationUpdate } from "./application/use-case/user-poc-information-update.ts";

export const userPOCInformation = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  database: PortDatabase,
  domainType: string,
  generate: PortGenerate,
  logger: PortLogger,
) => {
  const adapterDrivenUserPOCInformationCreate =
    new AdapterDrivenUserPOCInformationCreate(config, database, logger);
  const useCaseUserPOCInformationCreate = new UseCaseUserPOCInformationCreate(
    config,
    adapterDrivenUserPOCInformationCreate,
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
  const adapterDrivenUserPOCInformationRead =
    new AdapterDrivenUserPOCInformationRead(config, database, logger);
  const useCaseUserPOCInformationRead = new UseCaseUserPOCInformationRead(
    config,
    adapterDrivenUserPOCInformationRead,
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

  return {
    useCaseUserPOCInformationCreate,
    useCaseUserPOCInformationDelete,
    useCaseUserPOCInformationRead,
    useCaseUserPOCInformationReadID,
    useCaseUserPOCInformationUpdate,
  };
};

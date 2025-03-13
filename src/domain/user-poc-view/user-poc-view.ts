import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../env.ts";
import type { PortCacher } from "../../infrastructure/application/port/cacher/cacher.ts";
import type { PortConfig } from "../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../infrastructure/application/port/database/database.ts";
import type { PortElasticsearch } from "../../infrastructure/application/port/elasticsearch/elasticsearch.ts";
import type { PortLogger } from "../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivingUserPOCCreate } from "../user-poc/application/port/driving/user-poc-create.ts";
import type { PortDrivingUserPOCDelete } from "../user-poc/application/port/driving/user-poc-delete.ts";
import type { PortDrivingUserPOCUpdate } from "../user-poc/application/port/driving/user-poc-update.ts";
import type { PortDrivingUserPOCInformationCreate } from "../user-poc-information/application/port/driving/user-poc-information-create.ts";
import type { PortDrivingUserPOCInformationDeleteUserId } from "../user-poc-information/application/port/driving/user-poc-information-delete-user-id.ts";
import type { PortDrivingUserPOCInformationUpdateUserId } from "../user-poc-information/application/port/driving/user-poc-information-update-user-id.ts";
import { AdapterDrivenUserPOCViewRead } from "./adapter/driven/user-poc-view-read.ts";
import { AdapterDrivenUserPOCViewReadID } from "./adapter/driven/user-poc-view-read-id.ts";
import { AdapterDrivenUserPOCViewSearch } from "./adapter/driven/user-poc-view-search.ts";
import { adapterDrivingUserPOCViewCreate } from "./adapter/driving/user-poc-view-create/user-poc-view-create.driving.ts";
import { adapterDrivingUserPOCViewDelete } from "./adapter/driving/user-poc-view-delete/user-poc-view-delete.driving.ts";
import { adapterDrivingUserPOCViewRead } from "./adapter/driving/user-poc-view-read/user-poc-view-read.driving.ts";
import { adapterDrivingUserPOCViewReadID } from "./adapter/driving/user-poc-view-read-id/user-poc-view-read-id.driving.ts";
import { adapterDrivingUserPOCViewSearch } from "./adapter/driving/user-poc-view-search/user-poc-view-search.driving.ts";
import { adapterDrivingUserPOCViewUpdate } from "./adapter/driving/user-poc-view-update/user-poc-view-update.driving.ts";
import { UseCaseUserPOCViewCreate } from "./application/use-case/user-poc-view-create.ts";
import { UseCaseUserPOCViewDelete } from "./application/use-case/user-poc-view-delete.ts";
import { UseCaseUserPOCViewRead } from "./application/use-case/user-poc-view-read.ts";
import { UseCaseUserPOCViewReadID } from "./application/use-case/user-poc-view-read-id.ts";
import { UseCaseUserPOCViewSearch } from "./application/use-case/user-poc-view-search.ts";
import { UseCaseUserPOCViewUpdate } from "./application/use-case/user-poc-view-update.ts";

export const userPOCView = (
  app: OpenAPIHono<Env>,
  basePath: string,
  cacher: PortCacher,
  config: PortConfig,
  database: PortDatabase,
  domainType: string,
  drivingUserPOCCreate: PortDrivingUserPOCCreate,
  drivingUserPOCDelete: PortDrivingUserPOCDelete,
  drivingUserPOCUpdate: PortDrivingUserPOCUpdate,
  drivingUserPOCInformationCreate: PortDrivingUserPOCInformationCreate,
  drivingUserPOCInformationDeleteUserId: PortDrivingUserPOCInformationDeleteUserId,
  drivingUserPOCInformationUpdateUserId: PortDrivingUserPOCInformationUpdateUserId,
  elasticsearch: PortElasticsearch,
  logger: PortLogger,
) => {
  const useCaseUserPOCViewCreate = new UseCaseUserPOCViewCreate(
    config,
    drivingUserPOCCreate,
    drivingUserPOCInformationCreate,
    logger,
  );
  adapterDrivingUserPOCViewCreate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCViewCreate,
  );
  const useCaseUserPOCViewDelete = new UseCaseUserPOCViewDelete(
    config,
    drivingUserPOCDelete,
    drivingUserPOCInformationDeleteUserId,
    logger,
  );
  adapterDrivingUserPOCViewDelete(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCViewDelete,
  );
  const adapterDrivenUserPOCViewRead = new AdapterDrivenUserPOCViewRead(
    cacher,
    config,
    database,
    logger,
  );
  const useCaseUserPOCViewRead = new UseCaseUserPOCViewRead(
    config,
    adapterDrivenUserPOCViewRead,
    logger,
  );
  adapterDrivingUserPOCViewRead(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCViewRead,
  );
  const adapterDrivenUserPOCViewReadID = new AdapterDrivenUserPOCViewReadID(
    cacher,
    config,
    database,
    logger,
  );
  const useCaseUserPOCViewReadID = new UseCaseUserPOCViewReadID(
    config,
    adapterDrivenUserPOCViewReadID,
    logger,
  );
  adapterDrivingUserPOCViewReadID(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCViewReadID,
  );
  const adapterDrivenUserPOCViewSearch = new AdapterDrivenUserPOCViewSearch(
    config,
    elasticsearch,
    logger,
  );
  const useCaseUserPOCViewSearch = new UseCaseUserPOCViewSearch(
    config,
    adapterDrivenUserPOCViewSearch,
    logger,
  );
  adapterDrivingUserPOCViewSearch(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCViewSearch,
  );
  const useCaseUserPOCViewUpdate = new UseCaseUserPOCViewUpdate(
    config,
    drivingUserPOCUpdate,
    drivingUserPOCInformationUpdateUserId,
    logger,
  );
  adapterDrivingUserPOCViewUpdate(
    app,
    basePath,
    config,
    domainType,
    logger,
    useCaseUserPOCViewUpdate,
  );

  return {
    useCaseUserPOCViewCreate,
    useCaseUserPOCViewDelete,
    useCaseUserPOCViewRead,
    useCaseUserPOCViewReadID,
    useCaseUserPOCViewSearch,
    useCaseUserPOCViewUpdate,
  };
};

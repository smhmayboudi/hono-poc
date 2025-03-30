import { pino } from "pino";

import { casbin } from "../src/infrastructure/adapter/casbin/casbin.ts";
import { config } from "../src/infrastructure/adapter/config/config.ts";
import { database } from "../src/infrastructure/adapter/database/database.ts";
import { Logger } from "../src/infrastructure/adapter/logger/logger.ts";

const level = "trace";
const database2 = database(config, new Logger(pino({ level })));
const casbin2 = casbin(config, database2, new Logger(pino({ level })));
await casbin2.addPolicies([
  ["public", "/api/v1/auth/*", "*"],
  ["public", "/api/v1/*", "*"],
]);
await casbin2.addGroupingPolicy("anonymous", "public");
// eslint-disable-next-line n/no-process-exit
process.exit(0);

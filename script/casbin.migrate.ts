import { pino } from "pino";

import { casbin } from "../src/infrastructure/adapter/casbin/casbin.ts";
import { config } from "../src/infrastructure/adapter/config/config.ts";
import { database } from "../src/infrastructure/adapter/database/database.ts";
import { Logger } from "../src/infrastructure/adapter/logger/logger.ts";
import { tracer } from "../src/infrastructure/adapter/opentelemetry/opentelemetry.ts";

const level = "trace";
const config2 = config(tracer);
const database2 = database(config2, new Logger(pino({ level })), tracer);
const casbin2 = casbin(config2, database2, new Logger(pino({ level })), tracer);
await casbin2.addPolicies([
  ["public", "/api/v1/auth/*", "*"],
  ["public", "/api/v1/*", "*"],
]);
await casbin2.addGroupingPolicy("anonymous", "public");
// eslint-disable-next-line n/no-process-exit
process.exit(0);

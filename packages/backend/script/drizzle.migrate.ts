import * as path from "node:path";

import { migrate } from "drizzle-orm/mysql2/migrator";
import { pino } from "pino";

import { config } from "../src/infrastructure/adapter/config/config.ts";
import { database } from "../src/infrastructure/adapter/database/database.ts";
import { Logger } from "../src/infrastructure/adapter/logger/logger.ts";
import { tracer } from "../src/infrastructure/adapter/opentelemetry/opentelemetry.ts";

const level = "trace";
const config2 = config(tracer);
const database2 = database(config2, new Logger(pino({ level })), tracer);
await migrate(database2.db(), {
  migrationsFolder: path.join(import.meta.dirname, "../drizzle/"),
});
// eslint-disable-next-line n/no-process-exit
process.exit(0);

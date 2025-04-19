import path from "node:path";

import { migrate } from "drizzle-orm/mysql2/migrator";
import { pino } from "pino";

import { config } from "../src/infrastructure/adapter/config/config.ts";
import { database } from "../src/infrastructure/adapter/database/database.ts";
import { Logger } from "../src/infrastructure/adapter/logger/logger.ts";

const level = "trace";
const database2 = database(config, new Logger(pino({ level })));
await migrate(database2.db(), {
  migrationsFolder: path.join(import.meta.dirname, "../drizzle/"),
});
// eslint-disable-next-line n/no-process-exit
process.exit(0);

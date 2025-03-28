import { newEnforcer } from "casbin";
import { pino } from "pino";

import { CasbinDrizzleAdapter } from "../src/infrastructure/adapter/casbin/casbin-drizzle-adapter.ts";
import { config } from "../src/infrastructure/adapter/config/config.ts";
import { database } from "../src/infrastructure/adapter/database/database.ts";
import { Logger } from "../src/infrastructure/adapter/logger/logger.ts";

const level = "trace";
const database2 = database(config, new Logger(pino({ level })));
const enforcer = await newEnforcer(
  "./.docker/app/model.conf",
  new CasbinDrizzleAdapter(database2),
);

enforcer.addPolicies([
  ["public", "/api/v1/auth/*", "*"],
  ["public", "/api/v1/*", "*"],
]);

enforcer.addGroupingPolicy("anonymous", "public");

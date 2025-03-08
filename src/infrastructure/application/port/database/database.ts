import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Pool } from "mysql2";

import type * as schema from "./schema/schema.ts";

export interface PortDatabase {
  db(): MySql2Database<typeof schema> & {
    $client: Pool;
  };
}

import {
  mysqlTable,
  primaryKey,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const userPOC = mysqlTable(
  "table_user_poc",
  {
    id: varchar("id", { length: 24 }).notNull(),
    fullname: varchar("fullname", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date", fsp: 0 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", fsp: 0 })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id] }), unique().on(table.fullname)],
);

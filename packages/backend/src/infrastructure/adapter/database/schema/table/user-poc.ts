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
    id: varchar({ length: 24 }).notNull(),
    fullname: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ mode: "date", fsp: 0 }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "date", fsp: 0 }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.id] }), unique().on(table.fullname)],
);

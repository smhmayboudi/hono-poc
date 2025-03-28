import {
  int,
  mysqlTable,
  primaryKey,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const userPOCInformation = mysqlTable(
  "table_user_poc_information",
  {
    id: varchar({ length: 24 }).notNull(),
    userId: varchar({ length: 24 }).notNull(),
    address: varchar({ length: 255 }).notNull(),
    age: int({ unsigned: true }).notNull(),
    createdAt: timestamp({ mode: "date", fsp: 0 }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "date", fsp: 0 }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    unique().on(table.userId),
    unique().on(table.address),
    unique().on(table.age),
  ],
);

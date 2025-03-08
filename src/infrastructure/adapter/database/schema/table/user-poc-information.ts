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
    id: varchar("id", { length: 24 }).notNull(),
    userId: varchar("userId", { length: 24 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    age: int("age", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "date", fsp: 0 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", fsp: 0 })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    unique().on(table.userId),
    unique().on(table.address),
    unique().on(table.age),
  ],
);

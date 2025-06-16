import {
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const csp = mysqlTable(
  "table_csp",
  {
    id: varchar({ length: 24 }).notNull(),
    timestamp: timestamp({ mode: "date", fsp: 0 }).defaultNow().notNull(),
    cspReportBlockedUri: varchar({ length: 255 }).notNull(),
    cspReportDisposition: varchar({ length: 255 }).notNull(),
    cspReportDocumentUri: varchar({ length: 255 }).notNull(),
    cspReportEffectiveDirective: varchar({ length: 255 }).notNull(),
    cspReportOriginalPolicy: text().notNull(),
    cspReportScriptSample: varchar({ length: 255 }).notNull(),
    cspReportReferrer: varchar({ length: 255 }).notNull(),
    cspReportStatusCode: int({ unsigned: true }).notNull(),
    cspReportViolatedDirective: varchar({ length: 255 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);

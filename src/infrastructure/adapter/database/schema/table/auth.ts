import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("auth_user", {
  id: varchar({ length: 36 }).primaryKey(),
  name: text().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  role: text(),
  banned: boolean(),
  banReason: text(),
  banExpires: timestamp(),
  phoneNumber: varchar({ length: 255 }).unique(),
  phoneNumberVerified: boolean(),
  username: varchar({ length: 255 }).unique(),
  displayUsername: text(),
});

export const session = mysqlTable("auth_session", {
  id: varchar({ length: 36 }).primaryKey(),
  expiresAt: timestamp().notNull(),
  token: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: varchar({ length: 36 })
    .notNull()
    .references(() => user.id),
  impersonatedBy: text(),
});

export const account = mysqlTable("auth_account", {
  id: varchar({ length: 36 }).primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: varchar({ length: 36 })
    .notNull()
    .references(() => user.id),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const verification = mysqlTable("auth_verification", {
  id: varchar({ length: 36 }).primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const jwks = mysqlTable("auth_jwks", {
  id: varchar({ length: 36 }).primaryKey(),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp(),
});

export const rateLimit = mysqlTable("auth_rate_limit", {
  id: varchar({ length: 36 }).primaryKey(),
  key: text(),
  count: int(),
  lastRequest: int(),
});

export const casbin = mysqlTable("auth_casbin", {
  id: int().primaryKey().autoincrement().notNull(),
  ptype: varchar({ length: 255 }),
  v0: varchar({ length: 255 }),
  v1: varchar({ length: 255 }),
  v2: varchar({ length: 255 }),
  v3: varchar({ length: 255 }),
  v4: varchar({ length: 255 }),
  v5: varchar({ length: 255 }),
});

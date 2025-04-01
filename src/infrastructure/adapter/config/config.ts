import { z } from "@hono/zod-openapi";

import { getEnv } from "../../../app.env.ts";
import type { PortClientConfig } from "../../application/port/config/client/index.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortServerConfig } from "../../application/port/config/server/index.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";
import { Database } from "./client/database.ts";
import { Elasticsearch } from "./client/elasticsearch.ts";
import { ClientConfig } from "./client/index.ts";
import { Redis } from "./client/redis.ts";
import { Auth } from "./server/auth.ts";
import { Feature } from "./server/feature.ts";
import { ServerConfig } from "./server/index.ts";
import { Server } from "./server/server.ts";

export class Config implements PortConfig {
  constructor(
    private readonly _client: PortClientConfig,
    private readonly _server: PortServerConfig,
  ) {}

  client(): PortClientConfig {
    return this._client;
  }

  server(): PortServerConfig {
    return this._server;
  }
}

const envSchema = z.object({
  CLIENT_DATABASE_URI: z
    .string()
    .default(
      "mysql://mysql_user:mysql_password@mysql:3306/hono-poc?charset=utf8mb4&connectionLimit=1",
    ),
  CLIENT_ELASTICSEARCH_NODE: z.string().default("https://elasticsearch:9200"),
  CLIENT_REDIS_URL: z.string().default("redis://redis:6379"),
  SERVER_AUTH_APP_NAME: z.string().default("Hono POC"),
  SERVER_AUTH_BASE_URL: z.string().default("http://127.0.0.1:8081"),
  SERVER_AUTH_SECRET: z
    .string()
    .length(32)
    .default("hono-poc-12345678901234567890-!@"),
  SERVER_FEATURE_FLAG_USER_POC_FULLNAME: z.coerce
    .number()
    .nonnegative()
    .lte(1)
    .default(0)
    .transform((val) => val === 1),
  SERVER_SERVER_PORT: z.coerce
    .number()
    .int()
    .nonnegative()
    .lte(65535)
    .default(8081),
});
const env = envSchema.parse(getEnv());

export const config = tracer.startActiveSpan(
  "config.infrastructure",
  () =>
    new Config(
      new ClientConfig(
        new Database(env.CLIENT_DATABASE_URI),
        new Elasticsearch(env.CLIENT_ELASTICSEARCH_NODE),
        new Redis(env.CLIENT_REDIS_URL),
      ),
      new ServerConfig(
        new Auth(
          env.SERVER_AUTH_APP_NAME,
          env.SERVER_AUTH_BASE_URL,
          env.SERVER_AUTH_SECRET,
        ),
        new Feature(env.SERVER_FEATURE_FLAG_USER_POC_FULLNAME),
        new Server(env.SERVER_SERVER_PORT),
      ),
    ),
);

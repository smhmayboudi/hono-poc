import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { createId, init } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer, jwt, openAPI } from "better-auth/plugins";
import type { Context } from "hono";

import type { Env } from "../../../env.ts";
import type { PortAuth, Session } from "../../application/port/auth/auth.ts";
import type { PortCacher } from "../../application/port/cacher/cacher.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/database/database.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";
import { ac, roles } from "./auth-admin.ts";
import { AuthLogger } from "./auth-logger.ts";
import { AuthSecondaryStorage } from "./auth-secondary-storage.ts";

const betterAuth2 = (
  basePath: string,
  cacher: PortCacher,
  config: PortConfig,
  database: PortDatabase,
  disabledPaths: string[],
  logger: PortLogger,
  loggerLogger: PortLogger,
  loggerSecondaryStorage: PortLogger,
  // tracer: PortTracer,
) =>
  betterAuth({
    advanced: {
      cookiePrefix: "hono-poc",
      generateId: (options): string => {
        logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "generateId-advanced-auth.infrastructure",
          config,
          options,
        });
        logger.debug({});
        init({ length: options.size ?? 0 });

        return createId();
      },
    },
    appName: config.server().auth().appName(),
    basePath: `${basePath}/auth`,
    baseURL: config.server().auth().baseURL(),
    database: drizzleAdapter(database.db(), {
      provider: "mysql",
    }),
    disabledPaths,
    emailAndPassword: {
      autoSignIn: false,
      enabled: true,
    },
    logger: new AuthLogger(false, "debug", loggerLogger),
    onAPIError: {
      onError: (error, ctx) => {
        logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "onError-onAPIError-auth.infrastructure",
          config,
          ctx,
          error,
        });
        logger.error({});
      },
    },
    plugins: [
      admin({ ac, roles }),
      bearer(),
      jwt({
        jwt: {
          definePayload: (session) => {
            logger.assign({
              [ATTR_CODE_FUNCTION_NAME]:
                "definePayload-jwt-jwt-auth.infrastructure",
              config,
              session,
            });
            logger.debug({});

            return {};
          },
        },
      }),
      openAPI(),
    ],
    rateLimit: { storage: "database" },
    secondaryStorage: new AuthSecondaryStorage(
      cacher,
      config,
      loggerSecondaryStorage,
    ),
    secret: config.server().auth().secret(),
  });

export class Auth2 implements PortAuth {
  constructor(
    private readonly auth: ReturnType<typeof betterAuth2>,
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
    // private readonly tracer: PortTracer,
  ) {}

  handler(request: Request): Promise<Response> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "handler-auth.infrastructure",
      config: this.config,
    });
    this.logger.debug({});

    return this.auth.handler(request);
  }

  async roleHasPermission(
    permission: Record<string, string[]>,
    role: "admin" | "user",
  ): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "roleHasPermission-auth.infrastructure",
      config: this.config,
      role,
    });
    this.logger.debug({});
    const userHasPermission = await this.auth.api.userHasPermission({
      body: { permission, role },
    });
    this.logger.debug({ userHasPermission });

    return userHasPermission.success;
  }

  async session(ctx: Context<Env>): Promise<Session | null> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "session-auth.infrastructure",
      config: this.config,
    });
    this.logger.debug({});
    const session = await this.auth.api.getSession({
      headers: ctx.req.raw.headers,
    });
    this.logger.debug({ session });

    return session;
  }

  async userHasPermission(
    permission: Record<string, string[]>,
    userId: string,
  ): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "userHasPermission-auth.infrastructure",
      config: this.config,
      userId,
    });
    this.logger.debug({});
    const userHasPermission = await this.auth.api.userHasPermission({
      body: { permission, userId },
    });
    this.logger.debug({ userHasPermission });

    return userHasPermission.success;
  }
}

export const auth = (
  basePath: string,
  cacher: PortCacher,
  config: PortConfig,
  database: PortDatabase,
  disabledPaths: string[],
  logger: PortLogger,
  loggerBA: PortLogger,
  loggerBALogger: PortLogger,
  loggerBASecondaryStorage: PortLogger,
  tracer: PortTracer,
) =>
  tracer.startActiveSpan("auth.infrastructure", () => {
    return new Auth2(
      betterAuth2(
        basePath,
        cacher,
        config,
        database,
        disabledPaths,
        loggerBA,
        loggerBALogger,
        loggerBASecondaryStorage,
      ),
      config,
      logger,
    );
  });

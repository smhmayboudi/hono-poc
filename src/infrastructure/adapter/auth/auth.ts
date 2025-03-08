import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { createId, init } from "@paralleldrive/cuid2";
import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  bearer,
  jwt,
  openAPI,
  phoneNumber,
  username,
} from "better-auth/plugins";
import type { Context } from "hono";

import type { Env } from "../../../env.ts";
import type { PortAuth, Session } from "../../application/port/auth/auth.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/database/database.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

const basePath = "/api/v1";

export const auth2 = (
  config: PortConfig,
  database: PortDatabase,
  logger: PortLogger,
) =>
  betterAuth({
    advanced: {
      cookiePrefix: "hono-poc",
      generateId: (options): string => {
        init({ length: options.size ?? 0 });

        return createId();
      },
      ipAddress: {
        ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      },
    },
    basePath: `${basePath}/auth`,
    emailAndPassword: { enabled: true },
    database: drizzleAdapter(database.db(), {
      provider: "mysql",
    }),
    logger: {
      disabled: false,
      level: "debug",
      log: (level, message, ...args) => {
        switch (level) {
          case "debug":
            logger.debug(message, args);
            break;
          case "error":
            logger.error(message, args);
            break;
          case "info":
            logger.info(message, args);
            break;
          case "warn":
            logger.warn(message, args);
            break;
          default:
            throw new Error("Invalid log level");
        }
      },
    },
    rateLimit: {
      enabled: true,
      max: 100,
      // storage: "database",
      storage: "memory",
      window: 10,
    },
    plugins: [
      admin() as BetterAuthPlugin,
      bearer() as BetterAuthPlugin,
      jwt({ jwt: { definePayload: () => ({}) } }),
      openAPI(),
      phoneNumber({
        sendOTP: ({ code, phoneNumber }, request) => {
          logger.assign({
            [ATTR_CODE_FUNCTION_NAME]: "sendOTP",
            code,
            config,
            phoneNumber,
            url: request?.url,
          });
          logger.info({});
        },
        signUpOnVerification: {
          getTempEmail: (phoneNumber: string) => {
            logger.assign({
              [ATTR_CODE_FUNCTION_NAME]: "getTempEmail",
              config,
              phoneNumber,
            });
            logger.info({});
            const tempEmail = `${phoneNumber}@phone`;
            logger.debug({ tempEmail });

            return tempEmail;
          },
        },
      }),
      username(),
    ],
    session: {
      cookieCache: { enabled: true, maxAge: 5 * 60 },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });

export class Auth implements PortAuth {
  private readonly auth: ReturnType<typeof auth2>;
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {
    this.auth = auth2(this.config, this.database, this.logger);
  }

  handler(request: Request): Promise<Response> {
    return this.auth.handler(request);
  }

  async session(ctx: Context<Env>): Promise<Session | null> {
    const session = await this.auth.api.getSession({
      headers: ctx.req.raw.headers,
    });

    return session;
  }
}

export const auth = (
  config: PortConfig,
  database: PortDatabase,
  logger: PortLogger,
) =>
  tracer.startActiveSpan(
    "auth.infrastructure",
    () => new Auth(config, database, logger),
  );

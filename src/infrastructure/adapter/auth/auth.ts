import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { createId, init } from "@paralleldrive/cuid2";
import type { Auth } from "better-auth";
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

export class Auth2 implements PortAuth {
  constructor(
    private readonly auth: Auth,
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {}

  handler(request: Request): Promise<Response> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "handler-auth.infrastructure",
      config: this.config,
    });
    this.logger.debug({});

    return this.auth.handler(request);
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

    return session;
  }
}

export const auth = (
  basePath: string,
  config: PortConfig,
  database: PortDatabase,
  logger: PortLogger,
) =>
  tracer.startActiveSpan("auth.infrastructure", () => {
    const auth = betterAuth({
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
              [ATTR_CODE_FUNCTION_NAME]: "sendOTP-auth.infrastructure",
              code,
              config,
              phoneNumber,
              url: request?.url,
            });
            logger.debug({});
          },
          signUpOnVerification: {
            getTempEmail: (phoneNumber: string) => {
              logger.assign({
                [ATTR_CODE_FUNCTION_NAME]: "getTempEmail-auth.infrastructure",
                config,
                phoneNumber,
              });
              logger.debug({});
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
    }) as unknown as Auth;

    return new Auth2(auth, config, logger);
  });

import { z } from "zod";

import type { SessionData } from "~/session.server";

const envSchema = z.object({
  APP_PAGINATION_LIMIT: z
    .string()
    .refine((arg) => !Number.isNaN(Number(arg)) && Number(arg) >= 1, {
      message: "The string must be a valid number greater than or equal to 1",
    })
    .default("10"),
  APP_PAGINATION_OFFSET: z
    .string()
    .refine((arg) => !Number.isNaN(Number(arg)) && Number(arg) >= 0, {
      message: "The string must be a valid number greater than or equal to 0",
    })
    .default("0"),
  AUTH_CLIENT_BASE_URL: z.string().default("http://127.0.0.1:8081/api/v1/auth"),
  CLIENT_BASE_URL: z.string().default("http://127.0.0.1:8081/"),
  COOKIE_SECRET: z.string().default("s3cret!"),
  CSRF_SECRET: z.string().default("s3cret!"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .refine((arg) => !Number.isNaN(Number(arg)) && Number(arg) >= 1, {
      message: "The string must be a valid number greater than or equal to 1",
    })
    .transform((arg) => Number(arg))
    .default("3010"),
  SESSION_SECRET: z.string().default("s3cret!"),
});

type EnvServer = z.infer<typeof envSchema>;
type EnvClient = Omit<
  z.infer<typeof envSchema>,
  | "AUTH_CLIENT_BASE_URL"
  | "CLIENT_BASE_URL"
  | "COOKIE_SECRET"
  | "CSRF_SECRET"
  | "NODE_ENV"
  | "PORT"
  | "SESSION_SECRET"
>;

let env: EnvServer;

const initEnv = () => {
  const envData = envSchema.safeParse(process.env);
  if (!envData.success) {
    console.error(
      "❌ Invalid environment variables:",
      envData.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }
  env = envData.data;
  Object.freeze(env);
  if (env.NODE_ENV !== "test") {
    console.log("✅ Environment variables loaded successfully");
  }

  return env;
};

export const getEnvServer = (): EnvServer => (env ? env : initEnv());

export const getEnvClient = (): EnvClient => ({
  APP_PAGINATION_LIMIT: getEnvServer().APP_PAGINATION_LIMIT,
  APP_PAGINATION_OFFSET: getEnvServer().APP_PAGINATION_OFFSET,
});

declare global {
  interface Window {
    env: EnvClient;
    session?: SessionData | null;
    token: string;
  }
}

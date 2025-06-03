import { z } from "zod";

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
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type EnvServer = z.infer<typeof envSchema>;
type EnvClient = Omit<z.infer<typeof envSchema>, "NODE_ENV">;

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
  }
}

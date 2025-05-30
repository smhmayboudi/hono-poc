import { z } from "zod";

const envSchema = z.object({
  APP_ENV: z
    .enum(["development", "production", "staging"])
    .default("development"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type EnvServer = z.infer<typeof envSchema>;
type EnvClient = Omit<z.infer<typeof envSchema>, "APP_ENV">;

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
  NODE_ENV: getEnvServer().NODE_ENV,
});

declare global {
  interface Window {
    env: EnvClient;
  }
}

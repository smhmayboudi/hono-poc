import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getEnvServer } from "./env.server";

export const authClient = createAuthClient({
  baseURL: getEnvServer().AUTH_CLIENT_BASE_URL,
  credentials: "include",
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
  },
  headers: { accept: "application/json", authorization: "Bearer" },
  plugins: [jwtClient()],
}) as ReturnType<typeof createAuthClient>;

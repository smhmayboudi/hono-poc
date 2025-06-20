import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getEnvServer } from "~/env.server";

export const authClient = createAuthClient({
  basePath: "/api/v1/auth",
  baseURL: getEnvServer().APP_BASE_URL,
  plugins: [jwtClient()],
});

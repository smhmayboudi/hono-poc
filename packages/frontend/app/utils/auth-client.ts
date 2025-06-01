import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://127.0.0.1:8081/api/v1/auth",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwtClient()],
}) as ReturnType<typeof createAuthClient>;

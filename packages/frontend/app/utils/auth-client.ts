import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://127.0.0.1:8081/api/v1/auth",
  credentials: "include",
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
  },
  headers: { accept: "application/json", authorization: "Bearer" },
  plugins: [jwtClient()],
}) as ReturnType<typeof createAuthClient>;

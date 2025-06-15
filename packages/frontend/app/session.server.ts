import { createCookieSessionStorage } from "react-router";

import { getEnvServer } from "./env.server";

export type SessionData = {
  token?: string;
  user?: {
    createdAt: Date;
    email: string;
    emailVerified: boolean;
    id: string;
    image?: string | null;
    name: string;
    updatedAt: Date;
  };
};

export type SessionFlashData = {
  error: string;
};

export const userSession = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    // encode
    // domain
    // expires
    httpOnly: true,
    maxAge: 6.048e5,
    name: "__user_session",
    // partitioned
    path: "/",
    priority: "medium",
    sameSite: "lax",
    secrets: [getEnvServer().SESSION_SECRET],
    secure: getEnvServer().NODE_ENV === "production",
  },
});

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

type SessionFlashData = {
  error: string;
};

export const { commitSession, destroySession, getSession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      // domain
      // expires
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      name: "__user_session",
      path: "/",
      sameSite: "lax",
      secrets: [getEnvServer().SESSION_SECRET],
      secure: getEnvServer().NODE_ENV === "production",
    },
  });

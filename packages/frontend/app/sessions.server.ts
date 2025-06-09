import { createCookieSessionStorage } from "react-router";

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
      secrets: [process.env.APP_SESSION_SECRET || "s3cret!"],
      secure: process.env.NODE_ENV === "production",
    },
  });

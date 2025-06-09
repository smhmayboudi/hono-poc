import { createCookie } from "react-router";

export const userPreferences = createCookie("__user_preferences", {
  // expires
  // domain
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax",
  secrets: [process.env.APP_COOKIE_SECRET || "s3cret!"],
  secure: process.env.NODE_ENV === "production",
});

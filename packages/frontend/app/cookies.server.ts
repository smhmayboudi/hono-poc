import { createCookie } from "react-router";

export const userPreferences = createCookie("__user_preferences", {
  // expires
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cret1"],
  secure: true,
});

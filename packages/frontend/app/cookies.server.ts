import { createCookie } from "react-router";

export const userPrefs = createCookie("user-prefs", {
  // expires
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cret1"],
  secure: true,
});

import { createCookie } from "react-router";

import { getEnvServer } from "./env.server";

export const userCookie = createCookie("__user_cookie", {
  // expires
  // domain
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax",
  secrets: [getEnvServer().COOKIE_SECRET],
  secure: getEnvServer().NODE_ENV === "production",
});

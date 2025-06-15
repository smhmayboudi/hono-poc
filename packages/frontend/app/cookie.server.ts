import { createCookie } from "react-router";

import { getEnvServer } from "./env.server";

export const userCookie = createCookie("__user_cookie", {
  // encode
  // expires
  // domain
  httpOnly: true,
  maxAge: 6.048e5,
  // partitioned
  path: "/",
  priority: "medium",
  sameSite: "lax",
  secrets: [getEnvServer().COOKIE_SECRET],
  secure: getEnvServer().NODE_ENV === "production",
});

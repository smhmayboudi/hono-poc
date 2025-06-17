import { createCookie } from "react-router";

import { getEnvServer } from "~/env.server";

export const csrfCookie = createCookie("__user_csrf", {
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

export const userPreferencesBanner = createCookie("__user_preferences_banner", {
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

export const userPreferencesTheme = createCookie("__user_preferences_theme", {
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

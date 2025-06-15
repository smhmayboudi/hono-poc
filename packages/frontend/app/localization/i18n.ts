import type { InitOptions } from "i18next";

import { supportedLanguages } from "~/localization/resource";

export default {
  defaultNS: "common",
  fallbackLng: "en",
  fallbackNS: "common",
  supportedLngs: supportedLanguages,
} satisfies Omit<InitOptions, "detection" | "react">;

import { RemixI18Next } from "remix-i18next/server";

import i18n from "./i18n";
import { resources } from "./resource";

export default new RemixI18Next({
  detection: {
    fallbackLanguage: i18n.fallbackLng,
    supportedLanguages: i18n.supportedLngs,
  },
  i18next: {
    ...i18n,
    resources,
  },
});

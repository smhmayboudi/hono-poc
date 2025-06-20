import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";
import { getInitialNamespaces } from "remix-i18next/client";

import { AuthProvider } from "~/components/auth-provider";
import { BannerProvider } from "~/components/banner-provider";
import { BroadcastChannelProvider } from "~/components/broadcast-channel-provider";
import { CSRFProvider } from "~/components/csrf-provider";
import { ThemeProvider } from "~/components/theme-provider";
import i18n from "~/localization/i18n";

const hydrate = async () => {
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...i18n,
      backend: {
        loadPath: "/resource/locales?lng={{lng}}&ns={{ns}}",
      },
      detection: {
        caches: [],
        order: ["htmlTag"],
      },
      ns: getInitialNamespaces(),
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18next}>
          <CSRFProvider token={window.csrf.token}>
            <BroadcastChannelProvider channelName="frontend">
              <AuthProvider session={window.session}>
                <BannerProvider>
                  <ThemeProvider>
                    <HydratedRouter />
                  </ThemeProvider>
                </BannerProvider>
              </AuthProvider>
            </BroadcastChannelProvider>
          </CSRFProvider>
        </I18nextProvider>
      </StrictMode>,
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/?search=requestIdleCallback
  window.setTimeout(hydrate, 1);
}

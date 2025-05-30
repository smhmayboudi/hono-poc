import enCommon from "../../resources/locales/en/common.json";
import faCommon from "../../resources/locales/fa/common.json";

const languages = ["en", "fa"] as const;
export const supportedLanguages = [...languages];
export type Language = (typeof languages)[number];

type Resource = {
  common: typeof enCommon;
};

export type Namespace = keyof Resource;

export const resources: Record<Language, Resource> = {
  en: { common: enCommon },
  fa: { common: faCommon },
};

declare module "i18next" {
  export interface CustomTypeOptions {
    defaultNS: "common";
    fallbackLng: "en";
    fallbackNS: "common";
    resources: Resource;
  }
}

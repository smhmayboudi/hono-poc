import { describe, expect, it } from "vitest";

import remixI18n from "~/localization/i18n.server";

describe("Remix I18n", () => {
  it("returns the correct default language from the request", async () => {
    expect.assertions(1);
    const request = new Request("http://localhost:3000");
    const defaultLanguage = await remixI18n.getLocale(request);
    expect(defaultLanguage).toBe("en");
  });

  it("returns the correct default language from the request if search param lang is invalid", async () => {
    expect.assertions(1);
    const request = new Request("http://localhost:3000?lng=invalid");
    const defaultLanguage = await remixI18n.getLocale(request);
    expect(defaultLanguage).toBe("en");
  });

  it("returns the correct language when specified in the search params from the request", async () => {
    expect.assertions(1);
    const request = new Request("http://localhost:3000?lng=fa");
    const defaultLanguage = await remixI18n.getLocale(request);
    expect(defaultLanguage).toBe("fa");
  });
});

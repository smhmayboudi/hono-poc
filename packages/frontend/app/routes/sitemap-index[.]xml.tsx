import { generateSitemapIndex } from "@forge42/seo-tools/sitemap";

import { supportedLanguages } from "~/localization/resource";
import { createDomain } from "~/utils/http";

import type { Route } from "./+types/sitemap-index[.]xml";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const domain = createDomain(request);
  const sitemaps = generateSitemapIndex(
    supportedLanguages.map((value) => ({
      lastmod: "2025-05-31",
      url: `${domain}/sitemap/${value}.xml`,
    })),
  );

  return new Response(sitemaps, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
    status: 200,
  });
};

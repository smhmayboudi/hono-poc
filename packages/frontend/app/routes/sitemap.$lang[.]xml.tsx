import { generateRemixSitemap } from "@forge42/seo-tools/remix/sitemap";

import { createDomain } from "~/utils/http";

import type { Route } from "./+types/sitemap.$lang[.]xml";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const domain = createDomain(request);
  const { routes } = await import("virtual:react-router/server-build");
  const sitemap = await generateRemixSitemap({
    domain,
    ignore: ["/resource/*"],
    // @ts-ignore
    routes,
    sitemapData: { lang: params.lang },
    urlTransformer: (url) => `${url}?lng=${params.lang}`,
  });

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml;charset=UTF8" },
  });
};

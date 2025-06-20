import { generateRobotsTxt } from "@forge42/seo-tools/robots";

import { createDomain } from "~/utils/http";

import type { Route } from "./+types/robots[.]txt";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const domain = createDomain(request);
  const robotsTxt = generateRobotsTxt([
    {
      userAgent: "*",
      [context.envServer.NODE_ENV === "production" ? "allow" : "disallow"]: [
        "/",
      ],
      sitemap: [`${domain}/sitemap-index.xml`],
    },
  ]);

  return new Response(robotsTxt);
};

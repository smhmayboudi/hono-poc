import { generateRobotsTxt } from "@forge42/seo-tools/robots";
import { data } from "react-router";

import { createDomain } from "~/utils/http";

import type { Route } from "./+types/robots[.]txt";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const { isProductionDeployment } = context;
  const domain = createDomain(request);
  const robotsTxt = generateRobotsTxt([
    {
      userAgent: "*",
      [isProductionDeployment ? "allow" : "disallow"]: ["/"],
      sitemap: [`${domain}/sitemap-index.xml`],
    },
  ]);

  return data(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

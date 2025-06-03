import type { Context } from "hono";

import { getEnvClient, getEnvServer } from "../app/env.server";
import type { Env } from "./app.env";
import { i18next } from "./app.i18next";

declare module "react-router" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext extends Awaited<ReturnType<typeof getLoadContext>> {}
}

type GetLoadContextArgs = {
  context?: {
    // cloudflare?: any;
    hono?: {
      context: Context<Env>;
    };
  };
  request: Request;
};

export const getLoadContext = async (args: GetLoadContextArgs) => {
  const body =
    args.context && args.context.hono
      ? args.context.hono.context.body
      : undefined;
  const locale =
    args.context && args.context.hono
      ? i18next.getLocale(args.context.hono.context)
      : "en";
  const t =
    args.context && args.context.hono
      ? await i18next.getFixedT(args.context.hono.context)
      : undefined;

  return {
    extra: "stuff",
    url: args.request.url,
    body: body as unknown,
    envClient: getEnvClient(),
    envServer: getEnvServer(),
    isProductionDeployment: getEnvServer().NODE_ENV === "production",
    locale,
    t,
  };
};

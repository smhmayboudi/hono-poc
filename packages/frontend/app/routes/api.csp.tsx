import type { AppType } from "backend";
import { hc } from "hono/client";

import type { Route } from "./+types/api.csp";

export const action = async ({ context, request }: Route.ActionArgs) => {
  console.log("CLIENT - clientAction");
  const client = hc<AppType>(context.envClient.APP_BASE_URL);
  await client.api.v1.csp.$post({ json: await request.json() });
  return new Response(null, { status: 204 });
};

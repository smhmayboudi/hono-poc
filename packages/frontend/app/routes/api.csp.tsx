import type { AppType } from "backend";
import { hc } from "hono/client";

import type { Route } from "./+types/api.csp";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("CLIENT - clientAction");
  const client = hc<AppType>("http://127.0.0.1:8081/");
  await client.api.v1.csp.$post({ json: await request.json() });
  return new Response(null, { status: 204 });
};

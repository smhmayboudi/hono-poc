import { userCookie } from "~/cookie.server";

import type { Route } from "./+types/api.preferences";

export const action = async ({ request }: Route.ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const jsonData = await request.json();
  cookie.showBanner = jsonData.showBanner !== false;

  return new Response(null, {
    headers: { "Set-Cookie": await userCookie.serialize(cookie) },
    status: 204,
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const showBanner = cookie.showBanner !== false;

  return new Response(JSON.stringify({ showBanner }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};

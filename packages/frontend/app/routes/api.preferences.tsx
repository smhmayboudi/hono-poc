import { userCookie } from "~/cookie.server";

import type { Route } from "./+types/api.preferences";

export const action = async ({ request }: Route.ActionArgs) => {
  const cookieHeader = request.headers.get("cookie");
  const cookieParsed = (await userCookie.parse(cookieHeader)) || {};
  const jsonData = await request.json();
  cookieParsed.showBanner = jsonData.showBanner !== false;

  return new Response(null, {
    headers: { "Set-Cookie": await userCookie.serialize(cookieParsed) },
    status: 204,
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get("cookie");
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const showBanner = cookie.showBanner !== false;

  return Response.json({ showBanner });
};

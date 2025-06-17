import { userPreferencesBanner, userPreferencesTheme } from "~/cookie.server";

import type { Route } from "./+types/api.preferences.$";

export const actionBanner = async (request: Request) => {
  const cookie =
    (await userPreferencesBanner.parse(request.headers.get("cookie"))) || {};
  const jsonData = await request.json();
  cookie.visible = jsonData.visible !== false;

  return new Response(null, {
    headers: { "Set-Cookie": await userPreferencesBanner.serialize(cookie) },
    status: 204,
  });
};

export const actionTheme = async (request: Request) => {
  const cookie =
    (await userPreferencesTheme.parse(request.headers.get("cookie"))) || {};
  const jsonData = await request.json();
  cookie.theme = jsonData.theme;

  return new Response(null, {
    headers: { "Set-Cookie": await userPreferencesTheme.serialize(cookie) },
    status: 204,
  });
};

export const loaderBanner = async (request: Request) => {
  const cookie =
    (await userPreferencesBanner.parse(request.headers.get("cookie"))) || {};
  const visible = cookie.visible !== false;

  return Response.json({ visible });
};

export const loaderTheme = async (request: Request) => {
  const cookie =
    (await userPreferencesTheme.parse(request.headers.get("cookie"))) || {};
  const theme = cookie.theme;

  return Response.json({ theme });
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const actionType = params["*"];
  switch (actionType) {
    case "banner":
      return actionBanner(request);
    case "theme":
      return actionTheme(request);
  }

  return Response.json(
    { error: "Not Found" },
    {
      headers: { "Content-Type": "application/json" },
      status: 404,
    },
  );
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const actionType = params["*"];
  switch (actionType) {
    case "banner":
      return loaderBanner(request);
    case "theme":
      return loaderTheme(request);
  }

  return Response.json(
    { error: "Not Found" },
    {
      headers: { "Content-Type": "application/json" },
      status: 404,
    },
  );
};

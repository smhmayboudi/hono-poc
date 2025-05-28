import { Form, href, redirect } from "react-router";

import Button from "~/components/ui/button";
import { userPrefs } from "~/cookies.server";
import Search from "~/routes/search";

import type { Route } from "./+types/_index";

export const action = async ({ request }: Route.ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  if (bodyParams.get("showBanner") === "hidden") {
    cookie.showBanner = false;
  }

  return redirect(href("/"), {
    headers: { "Set-Cookie": await userPrefs.serialize(cookie) },
  });
};

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const extra = context.extra;
  const url = context.url;

  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const showBanner = (cookie.showBanner as boolean) ?? true;

  return { extra, showBanner, url };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "New React Router App" },
//   { content: "Welcome to React Router!", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => (
  <div>
    {loaderData.showBanner ? (
      <div role="alert" className="alert alert-info">
        <svg
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
        <span>Don't miss our banner!</span>
        <Form method="post">
          <input name="showBanner" type="hidden" value="hidden" />
          <Button c_size="xs" type="submit">
            Hide
          </Button>
        </Form>
      </div>
    ) : (
      <></>
    )}
    <Search />
    <h1>React Router and Hono</h1>
    <h2>URL is {loaderData.url}</h2>
    <h3>Extra is {loaderData.extra}</h3>
  </div>
);

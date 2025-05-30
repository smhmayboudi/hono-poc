import { useTranslation } from "react-i18next";
import { Form, href, redirect } from "react-router";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import { userPreferences } from "~/cookies.server";
import Search from "~/routes/search";

import type { Route } from "./+types/_index";

export const action = async ({ request }: Route.ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPreferences.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  if (bodyParams.get("showBanner") === "hidden") {
    cookie.showBanner = false;
  }

  return redirect(href("/"), {
    headers: { "Set-Cookie": await userPreferences.serialize(cookie) },
  });
};

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const extra = context.extra;
  const url = context.url;

  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPreferences.parse(cookieHeader)) || {};
  const showBanner = cookie.showBanner ?? true;

  return { extra, showBanner, url };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "New React Router App" },
//   { content: "Welcome to React Router!", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {loaderData.showBanner ? (
        <div role="alert" className="alert alert-info">
          <Icon c_name="outline-info" />
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
      <h1>{t("hi")}</h1>
      <h1>React Router and Hono</h1>
      <h2>URL is {loaderData.url}</h2>
      <h3>Extra is {loaderData.extra}</h3>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, href, redirect } from "react-router";

import { useBroadcastChannel } from "~/components/broadcast-channel-provider";
import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import { userCookie } from "~/cookie.server";
import Search from "~/routes/search";

import type { Route } from "./+types/_index";

type BannerVisibilityMessage = {
  type: "VISIBILITY_UPDATE";
  visible: boolean;
};

export const action = async ({ request }: Route.ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();
  cookie.showBanner = bodyParams.get("showBanner") !== "hidden";

  return redirect(href("/"), {
    headers: { "Set-Cookie": await userCookie.serialize(cookie) },
  });
};

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const extra = context.extra;
  const url = context.url;
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const showBanner = cookie.showBanner ?? true;

  return { extra, showBanner, url };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "New React Router App" },
//   { content: "Welcome to React Router!", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const broadcastChannel = useBroadcastChannel();
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState<boolean>(loaderData.showBanner);

  useEffect(() => {
    setShowBanner(loaderData.showBanner);
  }, [loaderData.showBanner]);

  useEffect(() => {
    const cleanup = broadcastChannel.onMessage<BannerVisibilityMessage>(
      (message) => {
        if (message.type === "VISIBILITY_UPDATE") {
          setShowBanner(message.visible);
        }
      },
    );

    return () => {
      cleanup();
    };
  }, [broadcastChannel]);

  const handleHideBanner = () => {
    setShowBanner(false);
    broadcastChannel.postMessage<BannerVisibilityMessage>({
      type: "VISIBILITY_UPDATE",
      visible: false,
    });
  };

  return (
    <div>
      {showBanner ? (
        <div role="alert" className="alert alert-info">
          <Icon c_name="outline-info" />
          <span>Don't miss our banner!</span>
          <Form method="post" onSubmit={handleHideBanner}>
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

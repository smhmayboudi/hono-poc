import { useTranslation } from "react-i18next";

import Banner from "~/components/ui/banner";
import Search from "~/routes/search";

import type { Route } from "./+types/_index";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const extra = context.extra;
  const url = context.url;

  return { extra, url };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "New React Router App" },
//   { content: "Welcome to React Router!", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Banner />
      <Search />
      <h1>{t("hi")}</h1>
      <h1>React Router and Hono</h1>
      <h2>URL is {loaderData.url}</h2>
      <h3>Extra is {loaderData.extra}</h3>
    </div>
  );
};

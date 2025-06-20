import { useTranslation } from "react-i18next";

import { BannerStatus } from "~/components/banner-provider";
import Search from "~/routes/search";

import type { Route } from "./+types/_index";

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "New React Router App" },
//   { content: "Welcome to React Router!", name: "description" },
// ];

export default ({}: Route.ComponentProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <BannerStatus />
      <Search />
      <h1>{t("hi")}</h1>
      <h1>React Router and Hono</h1>
    </div>
  );
};

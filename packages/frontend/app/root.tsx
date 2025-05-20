import { FC, PropsWithChildren } from "react";
import { Links, LinksFunction, Meta, MetaFunction, Outlet, Scripts } from "react-router";

import styles from "~/styles/style.css?url";

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { content: "width=device-width, initial-scale=1.0", name:"viewport" },
];

export const links: LinksFunction = () => [
  { href: "/hono.svg", rel: "icon", type: "image/svg+xml" },
  { href: styles, rel: "stylesheet" },
];

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
};

export default () => {
  return <Outlet />;
};

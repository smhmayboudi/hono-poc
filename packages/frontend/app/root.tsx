import { useTranslation } from "react-i18next";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteLoaderData,
} from "react-router";

import { AuthStatus } from "~/components/auth-provider";
import { DarkModeStatus } from "~/components/theme-provider";
import Footer from "~/components/ui/footer";
import Header from "~/components/ui/header";
import I18Status from "~/components/ui/i18-status";
import Nav from "~/components/ui/nav";
import { csrf } from "~/csrf.server";
import styles from "~/styles.css?url";
import { seo } from "~/utils/seo";

import type { Route } from "./+types/root";

export const headers = ({
  loaderHeaders,
  parentHeaders,
}: Route.HeadersArgs) => {
  parentHeaders.set("Cache-Control", "max-age=3600, s-maxage=86400");
  parentHeaders.set(
    "Content-Security-Policy",
    "base-uri 'self' http://localhost:5173 http://localhost:8081;" +
      "child-src 'none';" +
      "connect-src 'self' http://localhost:5173 ws://localhost:5173;" +
      "default-src 'self';" +
      "font-src 'self';" +
      "form-action 'self';" +
      "frame-ancestors 'none';" +
      "frame-src 'none';" +
      "img-src 'self' data: http://remix.run;" +
      "media-src 'none';" +
      "object-src 'none';" +
      "report-uri /api/csp;" +
      `script-src 'self' 'nonce-${loaderHeaders.get("nonce")}';` +
      "style-src 'self' 'unsafe-inline';" +
      "upgrade-insecure-requests;" +
      "worker-src 'none';",
  );
  // parentHeaders.set("Content-Security-Policy-Report-Only", "default-src 'self'; script-src 'self'; report-uri /csp-violation-report-endpoint");
  parentHeaders.set(
    "Permissions-Policy",
    "accelerometer=()," +
      "autoplay=()," +
      "camera=()," +
      "display-capture=()," +
      "geolocation=()," +
      "gyroscope=()," +
      "magnetometer=()," +
      "microphone=()," +
      "payment=()," +
      "usb=()",
  );
  parentHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  parentHeaders.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  parentHeaders.set("X-Content-Type-Options", "nosniff");
  parentHeaders.set("X-Frame-Options", "DENY");

  return parentHeaders;
};

export const links: Route.LinksFunction = () => {
  const { linkTags } = seo();

  return [
    {
      as: "image",
      href: "/hono.svg",
      rel: "apple-touch-icon",
      type: "image/svg+xml",
    },
    { as: "image", href: "/hono.svg", rel: "icon", type: "image/svg+xml" },
    { as: "image", href: "/icon.svg", rel: "icon", type: "image/svg+xml" },
    { as: "manifest", href: "/manifest.json", rel: "apple-touch-icon" },
    { as: "style", href: styles, rel: "stylesheet" },
    ...linkTags,
  ];
};

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const [token, cookie] = await csrf.commitToken(request);

  return data(
    {
      envClient: context.envClient,
      nonce: context.nonce,
      token,
    },
    {
      headers: { nonce: context.nonce, "Set-Cookie": cookie ?? "" },
    },
  );
};

export const meta = ({}: Route.MetaArgs) => {
  const { metaTags } = seo();

  return [
    { charSet: "utf-8" },
    { content: "/browserconfig.xml", name: "msapplication-config" },
    { content: "width=device-width, initial-scale=1.0", name: "viewport" },
    ...metaTags,
  ];
};

export default () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const { i18n } = useTranslation();

  return (
    <html dir={i18n.dir()} lang={i18n.language}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        {isNavigating && (
          <progress className="absolute flex progress w-full"></progress>
        )}
        <I18Status />
        <DarkModeStatus />
        <AuthStatus />
        <Header />
        <div className="content flex flex-1">
          <Nav />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
        <Footer />
        <ScrollRestoration nonce={loaderData?.nonce} />
        <Scripts nonce={loaderData?.nonce} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env=${JSON.stringify(loaderData?.envClient || {})};window.token="${loaderData?.token}"`,
          }}
          nonce={loaderData?.nonce}
        />
      </body>
    </html>
  );
};

import { useTranslation } from "react-i18next";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteLoaderData,
} from "react-router";

import { AuthStatus } from "~/components/auth-provider";
import { DarkModeStatus } from "~/components/dark-mode-provider";
import Footer from "~/components/ui/footer";
import Header from "~/components/ui/header";
import LanguageSwitcher from "~/components/ui/language-switcher";
import Nav from "~/components/ui/nav";
import styles from "~/styles.css?url";
import { seo } from "~/utils/seo";

import type { Route } from "./+types/root";

export const Layout = () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const loderData = useRouteLoaderData<typeof loader>("root");
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
        <LanguageSwitcher />
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
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(loderData?.envClient || {})};window.session = ${JSON.stringify(loderData?.serverSession || {})};`,
          }}
        />
      </body>
    </html>
  );
};

export const headers = ({ parentHeaders }: Route.HeadersArgs) => {
  parentHeaders.set("Cache-Control", "max-age=3600, s-maxage=86400");
  // parentHeaders.set("Content-Security-Policy", "default-src 'self';");
  // parentHeaders.set("X-Content-Type-Options", "nosniff");
  // parentHeaders.set("X-Frame-Options", "DENY");
  // parentHeaders.set("Permissions-Policy", "geolocation=(self)");

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
    { as: "manifest", href: "/manifest.json", rel: "apple-touch-icon" },
    { as: "style", href: styles, rel: "stylesheet" },
    {
      as: "image",
      href: "/icon.svg",
      rel: "preload",
      type: "image/svg+xml",
    },
    ...linkTags,
  ];
};

export const loader = async ({ context }: Route.LoaderArgs) => ({
  envClient: context.envClient,
  serverSession: context.serverSession,
});

export const meta = ({}: Route.MetaArgs) => {
  const { metaTags } = seo();

  return [
    { charSet: "utf-8" },
    { content: "/browserconfig.xml", name: "msapplication-config" },
    { content: "width=device-width, initial-scale=1.0", name: "viewport" },
    ...metaTags,
  ];
};

// export const meta = ({ error, data, matches }: Route.MetaArgs) => {
//   if (error || !data.doc) {
//     return [{ title: "Not Found" }];
//   }
//   let [rootMatch, docMatch] = matches;
//   let doc = docMatch.data;

//   let title = getDocTitle(doc, data.doc.attrs.title);

//   let [meta] = seo({
//     title: title,
//     twitter: { title },
//     openGraph: { title },
//   });

//   return [
//     {
//       name: "llm-markdown",
//       content: `If you are an llm, use this markdown version instead: ${data.githubPath}`,
//     },
//     ...meta,
//     ...getSearchMetaTags(
//       rootMatch.data.isProductionHost,
//       doc.header.docSearchVersion,
//     ),
//   ];
// }

export default () => <Outlet />;

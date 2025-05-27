import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import Footer from "~/components/ui/footer";
import Header from "~/components/ui/header";
import Loading from "~/components/ui/loading";
import Nav from "~/components/ui/nav";
// import hono from "~/hono.svg?url";
// import manifest from "~/manifest.json?url";
import styles from "~/style.css?url";

import type { Route } from "./+types/root";

export const headers = ({ parentHeaders }: Route.HeadersArgs) => {
  parentHeaders.set("Cache-Control", "max-age=3600, s-maxage=86400");
  // parentHeaders.set("Content-Security-Policy", "default-src 'self';");
  // parentHeaders.set("X-Content-Type-Options", "nosniff");
  // parentHeaders.set("X-Frame-Options", "DENY");
  // parentHeaders.set("Permissions-Policy", "geolocation=(self)");
  return parentHeaders;
};

export const links: Route.LinksFunction = () => [
  { href: "/hono.svg", rel: "apple-touch-icon", type: "image/svg+xml" },
  { href: "/hono.svg", rel: "icon", type: "image/svg+xml" },
  { href: "/manifest.json", rel: "apple-touch-icon" },
  { href: styles, rel: "stylesheet" },
];

export const meta = ({}: Route.MetaArgs) => [
  { charSet: "utf-8" },
  { content: "/browserconfig.xml", name: "msapplication-config" },
  { content: "width=device-width, initial-scale=1.0", name: "viewport" },
];

// export function meta({ error, data, matches }: Route.MetaArgs) {
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

export const Layout = () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <html data-theme="light" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Nav />
          <main className="bg-white flex-1 p-6">
            {isNavigating && <Loading c_size="xl" />}
            <Outlet />
          </main>
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default () => <Outlet />;

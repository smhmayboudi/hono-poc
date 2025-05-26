import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import Footer from "~/components/footer";
import Header from "~/components/header";
import Nav from "~/components/nav";
import SpinnerGlobal from "~/components/spinner-global";
// import hono from "~/hono.svg?url";
// import manifest from "~/manifest.json?url";
import styles from "~/style.css?url";

import type { Route } from "./+types/root";

export const headers = ({ parentHeaders }: Route.HeadersArgs) => {
  parentHeaders.set(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  );
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
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Nav />
          <main className="flex-1 bg-white p-6">
            {isNavigating && <SpinnerGlobal />}
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

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.name}</p>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>
          <code>{error.stack}</code>
        </pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
};

export function HydrateFallback() {
  return <div>Loading...</div>;
}

import type { AppLoadContext, LoaderFunctionArgs } from "react-router";

import type { Route } from "./+types/_index";

export const loader = (args: LoaderFunctionArgs<AppLoadContext>) => {
  const extra = args.context.extra;
  const url = args.context.url;
  return { extra, url };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const { extra, url } = loaderData;
  return (
    <div>
      <h1>React Router and Hono</h1>
      <h2>URL is {url}</h2>
      <h3>Extra is {extra}</h3>
    </div>
  );
};

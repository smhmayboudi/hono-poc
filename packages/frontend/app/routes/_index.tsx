import Nav from "~/components/nav";

import type { Route } from "./+types/_index";

export const loader = ({ context }: Route.LoaderArgs) => {
  const extra = context.extra;
  const url = context.url;
  return { extra, url };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "New React Router App" },
//   { content: "Welcome to React Router!", name: "description" },
// ];

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

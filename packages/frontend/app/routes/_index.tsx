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

export default ({ loaderData }: Route.ComponentProps) => (
  <div>
    <h1>React Router and Hono</h1>
    <h2>URL is {loaderData.url}</h2>
    <h3>Extra is {loaderData.extra}</h3>
  </div>
);

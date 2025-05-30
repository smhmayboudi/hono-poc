import { href, useFetcher } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Icon from "~/components/ui/icon";
import Loading from "~/components/ui/loading";

import type { Route } from "./+types/search";

const users = [
  { id: 1, name: "Ryan" },
  { id: 2, name: "Michael" },
  { id: 3, name: "SMHMayboudi" },
  { id: 4, name: "SMH" },
  { id: 5, name: "S" },
];

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  return users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
};

export default () => {
  const fetcher = useFetcher<typeof clientLoader>();
  const busy = fetcher.state !== "idle";

  return (
    <div>
      <fetcher.Form action={href("/search")} method="get">
        <label className="input">
          {busy ? (
            <Loading
              c_size="xs"
              className="ml-1 mr-1 opacity-50 shrink-0 stroke-current w-4"
            />
          ) : (
            <Icon c_name="outlinr-search" className="h-[1em] opacity-50" />
          )}
          <input
            aria-label="Search"
            name="q"
            onChange={(event) => {
              fetcher.submit(event.currentTarget.form);
            }}
            placeholder="Search"
            type="search"
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </fetcher.Form>
      {fetcher.data?.length === 0 ? (
        <p>No Records</p>
      ) : (
        <ul
          className="list shadow-sm"
          style={{
            opacity: busy ? 0.25 : 1,
          }}
        >
          {fetcher.data?.map((user) => (
            <li className="list-row" key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

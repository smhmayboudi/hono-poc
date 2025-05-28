import { href, useFetcher } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
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
  console.log("SERVER - clientLoader");
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
        <input
          name="q"
          onChange={(event) => {
            fetcher.submit(event.currentTarget.form);
          }}
          type="text"
        />
        {busy ? <Loading c_size="xs" /> : <></>}
      </fetcher.Form>
      {fetcher.data?.length === 0 ? (
        <p>No Records</p>
      ) : (
        <ul
          style={{
            opacity: busy ? 0.25 : 1,
          }}
        >
          {fetcher.data?.map((user) => <li key={user.id}>{user.name}</li>)}
        </ul>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

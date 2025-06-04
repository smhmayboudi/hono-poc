import type { AppType } from "backend";
import { hc } from "hono/client";
import { href, useFetcher, useSubmit } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Icon from "~/components/ui/icon";
import { Link } from "~/components/ui/link";
import Loading from "~/components/ui/loading";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc-view.search";

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  await sleep(1000);
  const url = new URL(request.url);
  const limit =
    url.searchParams.get("limit") || window.env.APP_PAGINATION_LIMIT;
  const offset =
    url.searchParams.get("offset") || window.env.APP_PAGINATION_OFFSET;
  const query = url.searchParams.get("q") || "";
  const abortController = new AbortController();
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc-view"].search.$post(
    { json: { query }, query: { limit, offset } },
    { init: { signal: abortController.signal } },
  );
  if (res.ok) {
    const data = await res.json();

    return { abortController, data, query };
  }
  const { errors } = await res.json();

  return { errors };
};

// clientLoader.hydrate = true as const;

// export const loader = async ({ request }: Route.LoaderArgs) => {
//   console.log("SERVER - loader");
//   const url = new URL(request.url);
//   const limit =
//     url.searchParams.get("limit") || window.env.APP_PAGINATION_LIMIT;
//   const offset =
//     url.searchParams.get("offset") || window.env.APP_PAGINATION_OFFSET;
//   const query = url.searchParams.get("q") || "";
//   const abortController = new AbortController();
//   const client = hc<AppType>("http://127.0.0.1:8081/");
//   const res = await client.api.v1["user-poc-view"].search.$post(
//     { json: { query }, query: { limit, offset } },
//     { init: { signal: abortController.signal } },
//   );
//   if (res.ok) {
//     const { data } = await res.json();
//
//     return { abortController, data, query };
//   }
//   const { errors } = await res.json();
//
//   return { errors };
// };

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "User POC View Read" },
//   { content: "User POC View Read | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  // const navigation = useNavigation();
  // const busy = navigation.state !== "idle";
  const submit = useSubmit();

  return (
    <div>
      <fetcher.Form
        action={href("/dashboard/user-poc-view/search")}
        method="get"
        onChange={(event) => {
          submit(event.currentTarget, { replace: !!loaderData?.query });
        }}
      >
        <label className="input">
          {busy ? (
            <Loading
              c_size="xs"
              className="h-4 opacity-50 shrink-0 stroke-current w-4"
            />
          ) : (
            <Icon c_name="outlinr-search" className="h-4 opacity-50 w-4" />
          )}
          <input
            aria-label="Search"
            defaultValue={loaderData.query || ""}
            name="q"
            // onChange={(event) => {
            //   fetcher.submit(event.target.form);
            // }}
            placeholder="Search"
            type="search"
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </fetcher.Form>
      {loaderData.data?.data.length ? (
        <>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Address</th>
                <th>Age</th>
                <th>Fullname</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loaderData.data.data.map((value) => (
                <tr key={value.id}>
                  <td>{value.id}</td>
                  <td>{value.attributes?.address}</td>
                  <td>{value.attributes?.age}</td>
                  <td>{value.attributes?.fullname}</td>
                  <td>
                    <div className="join">
                      <Link
                        className="btn btn-ghost btn-xs join-item"
                        to={href("/dashboard/user-poc-view/:id/delete", {
                          id: value.id.toString(),
                        })}
                      >
                        DELETE
                      </Link>
                      <Link
                        className="btn btn-ghost btn-xs join-item"
                        to={href("/dashboard/user-poc-view/:id/read", {
                          id: value.id.toString(),
                        })}
                      >
                        DETAILS
                      </Link>
                      <Link
                        className="btn btn-ghost btn-xs join-item"
                        to={href("/dashboard/user-poc-view/:id/update", {
                          id: value.id.toString(),
                        })}
                      >
                        UPDATE
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </>
      ) : (
        <p>No Records</p>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

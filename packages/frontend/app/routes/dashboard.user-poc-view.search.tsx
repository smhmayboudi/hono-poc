import type { AppType } from "backend";
import { hc } from "hono/client";
import { href, useFetcher } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Icon from "~/components/ui/icon";
import { Link } from "~/components/ui/link";
import Loading from "~/components/ui/loading";
import { userSession } from "~/session.server";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc-view.search";

export const action = async ({ context, request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  await sleep(1000);
  const formData = await request.formData();
  const limit =
    (formData.get("limit") as string) || context.envClient.APP_PAGINATION_LIMIT;
  const offset =
    (formData.get("offset") as string) ||
    context.envClient.APP_PAGINATION_OFFSET;
  const search = (formData.get("search") as string) || "";
  const session = await userSession.getSession(request.headers.get("cookie"));
  const client = hc<AppType>(context.envClient.APP_BASE_URL, {
    headers: { authorization: `Bearer ${session.get("token") ?? ""}` },
  });
  const res = await client.api.v1["user-poc-view"].search.$post({
    json: { query: search },
    query: { limit, offset },
  });
  if (res.ok) {
    const { data } = await res.json();

    return { data, search };
  }
  const { errors } = await res.json();

  return { errors };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "User POC View Read" },
//   { content: "User POC View Read | description", name: "description" },
// ];

export default ({}: Route.ComponentProps) => {
  const fetcher = useFetcher<typeof action>();
  const busy = fetcher.state !== "idle";

  return (
    <div>
      <fetcher.Form
        action={href("/dashboard/user-poc-view/search")}
        method="post"
      >
        <label className="input">
          {busy ? (
            <Loading
              c_size="xs"
              className="h-4 opacity-50 shrink-0 stroke-current w-4"
            />
          ) : (
            <Icon c_name="outline-search" className="h-4 opacity-50 w-4" />
          )}
          <input
            aria-label="Search"
            name="search"
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
      {fetcher.data?.data?.length ? (
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
              {fetcher.data.data.map((value) => (
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
        <p className="p-3">No Records</p>
      )}
      {fetcher.data?.errors ? (
        fetcher.data.errors.map((values) => (
          <p key={values.code}>
            {values.title}[{values.code}]: {values.detail}
          </p>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

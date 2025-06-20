import type { AppType } from "backend";
import { hc } from "hono/client";
import { href, useRevalidator, useSearchParams } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Button from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc.read._index";

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  await sleep(1000);
  const url = new URL(request.url);
  const limit =
    url.searchParams.get("limit") || window.env.APP_PAGINATION_LIMIT;
  const offset =
    url.searchParams.get("offset") || window.env.APP_PAGINATION_OFFSET;
  const client = hc<AppType>(window.env.APP_BASE_URL, {
    headers: { authorization: `Bearer ${window.session?.token ?? ""}` },
  });
  const res = await client.api.v1["user-poc"].$get({
    query: { limit, offset },
  });
  if (res.ok) {
    const data = await res.json();

    return { data };
  }
  const { errors } = await res.json();

  return { errors };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "User POC Read" },
//   { content: "User POC Read | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const revalidator = useRevalidator();
  const busy = revalidator.state !== "idle";
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = parseInt(
    searchParams.get("limit") || window.env.APP_PAGINATION_LIMIT,
  );
  const offset = parseInt(
    searchParams.get("offset") || window.env.APP_PAGINATION_OFFSET,
  );
  const isFirstPage = offset === 0;
  const totalCount = loaderData.data?.meta?.total || 0;
  const isLastPage = totalCount > 0 && (offset + 1) * limit >= totalCount;

  const handlePagination = (url?: string) => {
    if (!url) {
      return;
    }
    const newUrl = new URL(url);
    const newURLSearchParams = new URLSearchParams(newUrl.search);
    if (newURLSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newURLSearchParams);
      revalidator.revalidate();
    }
  };

  return (
    <div>
      <Link className="btn btn-xs" to={href("/dashboard/user-poc/create")}>
        User POC Create
      </Link>
      {loaderData.data?.data.length ? (
        <>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fullname</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loaderData.data.data.map((value) => (
                <tr key={value.id}>
                  <td>{value.id}</td>
                  <td>{value.attributes?.fullname}</td>
                  <td>
                    <div className="join">
                      <Link
                        className="btn btn-ghost btn-xs join-item"
                        to={href("/dashboard/user-poc/:id/delete", {
                          id: value.id.toString(),
                        })}
                      >
                        DELETE
                      </Link>
                      <Link
                        className="btn btn-ghost btn-xs join-item"
                        to={href("/dashboard/user-poc/:id/read", {
                          id: value.id.toString(),
                        })}
                      >
                        DETAILS
                      </Link>
                      <Link
                        className="btn btn-ghost btn-xs join-item"
                        to={href("/dashboard/user-poc/:id/update", {
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
          <div className="join">
            <Button
              aria-label="First"
              className={
                !loaderData.data?.links?.first || busy || isFirstPage
                  ? "btn-disabled join-item"
                  : "join-item"
              }
              onClick={() =>
                handlePagination(loaderData.data?.links?.first?.toString())
              }
              disabled={!loaderData.data?.links?.first || busy || isFirstPage}
            >
              First
            </Button>
            <Button
              aria-label="Previous"
              className={
                !loaderData.data?.links?.prev || busy || isFirstPage
                  ? "btn-disabled join-item"
                  : "join-item"
              }
              onClick={() =>
                handlePagination(loaderData.data?.links?.prev?.toString())
              }
              disabled={!loaderData.data?.links?.prev || busy || isFirstPage}
            >
              Previous
            </Button>
            <Button
              aria-label="Next"
              className={
                !loaderData.data?.links?.next || busy || isLastPage
                  ? "btn-disabled join-item"
                  : "join-item"
              }
              onClick={() =>
                handlePagination(loaderData.data?.links?.next?.toString())
              }
              disabled={!loaderData.data?.links?.next || busy || isLastPage}
            >
              Next
            </Button>
            <Button
              aria-label="Last"
              className={
                !loaderData.data?.links?.last || busy || isLastPage
                  ? "btn-disabled join-item"
                  : "join-item"
              }
              onClick={() =>
                handlePagination(loaderData.data?.links?.last?.toString())
              }
              disabled={!loaderData.data?.links?.last || busy || isLastPage}
            >
              Last
            </Button>
          </div>
        </>
      ) : (
        <p className="p-3">No Records</p>
      )}
      {loaderData.errors ? (
        loaderData.errors.map((value) => (
          <span key={value.status}>
            {value.code} [{value.status}]: {value.detail}
          </span>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

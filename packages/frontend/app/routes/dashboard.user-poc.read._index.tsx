import { AppType } from "backend";
import { hc } from "hono/client";
import { href, Link } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";

import type { Route } from "./+types/dashboard.user-poc.read._index";

export const clientLoader = async ({}: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc"].$get({ query: {} });
  if (res.ok) {
    const { data } = await res.json();
    return { data };
  }
  const { errors } = await res.json();
  return { errors };
};

// clientLoader.hydrate = true as const;

// export const loader = async ({}: Route.LoaderArgs) => {
//   console.log("SERVER - loader");
//   const client = hc<AppType>("http://127.0.0.1:8081/");
//   const res = await client.api.v1["user-poc"].$get({ query: {} });
//   if (res.ok) {
//     const { data } = await res.json();
//     return { data };
//   }
//   const { errors } = await res.json();
//   return { errors };
// };

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "User POC Read" },
//   { content: "User POC Read | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => (
  <div>
    {loaderData.data?.length === 0 ? (
      <p>No Records</p>
    ) : (
      <>
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loaderData.data?.map((value) => (
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
          <input
            aria-label="1"
            checked
            className="btn btn-square join-item"
            name="options"
            type="radio"
          />
          <input
            aria-label="2"
            className="btn btn-square join-item"
            name="options"
            type="radio"
          />
          <input
            aria-label="3"
            className="btn btn-square join-item"
            name="options"
            type="radio"
          />
          <input
            className="btn btn-square join-item"
            type="radio"
            name="options"
            aria-label="4"
          />
        </div>
      </>
    )}
  </div>
);

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

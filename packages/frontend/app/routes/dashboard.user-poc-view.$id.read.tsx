import type { AppType } from "backend";
import { hc } from "hono/client";
import { href } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import { Link } from "~/components/ui/link";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc-view.$id.read";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  await sleep(1000);
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc-view"][":id"].$get({
    param: params,
  });
  if (res.ok) {
    const { data } = await res.json();

    return { data };
  }
  const { errors } = await res.json();

  return { errors };
};

// clientLoader.hydrate = true as const;

// export const loader = async ({ params }: Route.LoaderArgs) => {
//   console.log("SERVER - loader");
//   const client = hc<AppType>("http://127.0.0.1:8081/");
//   const res = await client.api.v1["user-poc-view"][":id"].$get({ param: params });
//   if (res.ok) {
//     const { data } = await res.json();
//
//     return { data };
//   }
//   const { errors } = await res.json();
//
//   return { errors };
// };

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: `User POC View ReadID #${params.id}` },
//   {
//     content: `User POC View ReadID #${params.id} | description`,
//     name: "description",
//   },
// ];

export default ({ loaderData, params }: Route.ComponentProps) => (
  <div>
    <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
      <legend className="fieldset-legend">
        User POC View #{params.id} Read
      </legend>
      <label className="input floating-label">
        <span>ID</span>
        <input
          aria-label="ID"
          disabled
          defaultValue={params.id}
          name="id"
          placeholder="ID"
          required
          type="text"
        />
      </label>
      <label className="input floating-label">
        <span>Address</span>
        <input
          aria-label="Address"
          disabled
          defaultValue={loaderData.data?.attributes?.address}
          name="address"
          placeholder="Address"
          required
          type="text"
        />
      </label>
      <label className="input floating-label">
        <span>Age</span>
        <input
          aria-label="Age"
          disabled
          defaultValue={loaderData.data?.attributes?.age}
          name="age"
          placeholder="Age"
          required
          type="text"
        />
      </label>
      <label className="input floating-label">
        <span>Fullname</span>
        <input
          aria-label="Fullname"
          disabled
          defaultValue={loaderData.data?.attributes?.fullname}
          name="fullname"
          placeholder="Fullname"
          required
          type="text"
        />
      </label>
      <input type="hidden" name="id" defaultValue={params.id} />
      <div className="join">
        <Link
          className="btn btn-ghost btn-xs join-item"
          to={href("/dashboard/user-poc-view/:id/delete", params)}
        >
          DELETE
        </Link>
        <Link
          className="btn btn-ghost btn-xs join-item"
          to={href("/dashboard/user-poc-view/:id/update", params)}
        >
          UPDATE
        </Link>
        <Link
          className="btn btn-ghost btn-xs join-item"
          to={href("/dashboard/user-poc-view/read")}
        >
          READ
        </Link>
      </div>
    </fieldset>
  </div>
);

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

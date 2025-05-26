import { href, Link } from "react-router";

import type { Route } from "./+types/dashboard.user-poc.$id.read";

export const clientLoader = ({ params }: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  return { id: params.id, fullname: "test" };
};

// clientLoader.hydrate = true as const;

export const loader = async ({ params }: Route.LoaderArgs) => {
  console.log("SERVER - loader");
  return { id: params.id, fullname: "test" };
};

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: `User POC ReadID #${params.id}` },
//   {
//     content: `User POC ReadID #${params.id} | description`,
//     name: "description",
//   },
// ];

export default ({ loaderData, params }: Route.ComponentProps) => (
  <div>
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
      <legend className="fieldset-legend">User POC #{params.id} Read</legend>
      <label className="floating-label">
        <span>ID</span>
        <input
          aria-label="Name"
          className="input validator"
          disabled
          defaultValue={params.id}
          id="id"
          name="id"
          placeholder="ID"
          required
          type="text"
        />
      </label>
      <label className="floating-label">
        <span>Name</span>
        <input
          aria-label="Name"
          className="input validator"
          disabled
          defaultValue={loaderData.fullname}
          id="name"
          name="name"
          placeholder="Name"
          required
          type="text"
        />
      </label>
      <input type="hidden" id="id" name="id" defaultValue={params.id} />
      <div className="join">
        <Link
          className="btn btn-ghost btn-xs join-item"
          to={href("/dashboard/user-poc/:id/delete", params)}
        >
          DELETE
        </Link>
        <Link
          className="btn btn-ghost btn-xs join-item"
          to={href("/dashboard/user-poc/:id/update", params)}
        >
          UPDATE
        </Link>
        <Link
          className="btn btn-ghost btn-xs join-item"
          to={href("/dashboard/user-poc/read")}
        >
          READ
        </Link>
      </div>
    </fieldset>
  </div>
);

export function HydrateFallback() {
  return <div>Loading...</div>;
}

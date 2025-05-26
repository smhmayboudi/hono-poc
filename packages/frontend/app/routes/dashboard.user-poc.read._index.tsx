import { href, Link } from "react-router";

import type { Route } from "./+types/dashboard.user-poc.read._index";

export const clientLoader = ({}: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  return { list: [{ id: 1, fullname: "test" }] };
};

// clientLoader.hydrate = true as const;

export const loader = ({}: Route.LoaderArgs) => {
  console.log("SERVER - loader");
  return { list: [{ id: 1, fullname: "test" }] };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "User POC Read" },
//   { content: "User POC Read | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => (
  <div>
    {loaderData.list.length === 0 ? (
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
            {loaderData.list.map((value) => (
              <tr key={value.id}>
                <td>{value.id}</td>
                <td>{value.fullname}</td>
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
            className="join-item btn btn-square"
            name="options"
            type="radio"
          />
          <input
            aria-label="2"
            className="join-item btn btn-square"
            name="options"
            type="radio"
          />
          <input
            aria-label="3"
            className="join-item btn btn-square"
            name="options"
            type="radio"
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="4"
          />
        </div>
      </>
    )}
  </div>
);

export function HydrateFallback() {
  return <div>Loading...</div>;
}

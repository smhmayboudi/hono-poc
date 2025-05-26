import { href, useFetcher, useNavigate } from "react-router";

import type { Route } from "./+types/dashboard.user-poc.$id.update";

export const action = async ({ params, request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const id = params.id;
  const formData = await request.formData();
  const fullname = formData.get("fullname")?.toString() ?? "";
  return { id, fullname };
};

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  const id = params.id;
  const formData = await request.formData();
  const fullname = formData.get("fullname")?.toString() ?? "";
  return { id, fullname };
};

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
//   { title: `User POC Update #${params.id}` },
//   {
//     content: `User POC Update #${params.id} | description`,
//     name: "description",
//   },
// ];

export default ({ actionData, loaderData, params }: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  // const { errors } = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div>
      <fetcher.Form method="post">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend className="fieldset-legend">
            User POC #{params.id} Update
          </legend>
          <label className="floating-label">
            <span>Name</span>
            <input
              aria-label="Name"
              className="input validator"
              defaultValue={loaderData.fullname}
              id="name"
              name="name"
              placeholder="Name"
              required
              type="text"
            />
            <div className="validator-hint">Please fill out this field.</div>
            {/* {errors?.name && <div>{errors.name}</div>} */}
          </label>
          <input type="hidden" id="id" name="id" defaultValue={params.id} />
          <div className="join">
            <button
              className="btn join-item btn-sm btn-active btn-primary"
              type="submit"
            >
              {busy ? <span className="loading loading-spinner" /> : "OK"}
            </button>
            <button
              className="btn btn-sm join-item"
              onClick={() => {
                navigate(href("/dashboard/user-poc/read"));
              }}
              type="button"
            >
              CANCEL
            </button>
          </div>
        </fieldset>
      </fetcher.Form>
      {actionData ? <p>#{actionData.id} updated</p> : null}
    </div>
  );
};

export function HydrateFallback() {
  return <div>Loading...</div>;
}

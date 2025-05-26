import { href, useFetcher, useNavigate } from "react-router";

import type { Route } from "./+types/dashboard.user-poc.create";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const formData = await request.formData();
  const fullname = formData.get("fullname")?.toString() ?? "";
  return { id: 1, fullname };
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  const formData = await request.formData();
  const fullname = formData.get("fullname")?.toString() ?? "";
  return { id: 1, fullname };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "User POC Create" },
//   { content: "User POC Create | description", name: "description" },
// ];

export default ({ actionData }: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  // const { errors } = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div>
      <fetcher.Form method="post">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend className="fieldset-legend">User POC Create</legend>
          <label className="floating-label">
            <span>Name</span>
            <input
              aria-label="Fullname"
              className="input validator"
              id="fullname"
              name="fullname"
              placeholder="Fullname"
              required
              type="text"
            />
            <div className="validator-hint">Please fill out this field.</div>
            {/* {errors?.name && <div>{errors.name}</div>} */}
          </label>
          <div className="join">
            <button
              className="btn join-item btn-sm btn-active btn-primary"
              disabled={busy}
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
      {actionData ? <p>#{actionData.id} created</p> : null}
    </div>
  );
};

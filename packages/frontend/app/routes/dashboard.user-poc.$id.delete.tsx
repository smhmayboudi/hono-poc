import { href, useFetcher, useNavigate } from "react-router";

import type { Route } from "./+types/dashboard.user-poc.$id.delete";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const formData = await request.formData();
  const id = formData.get("id")?.toString() ?? "";
  return { id };
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  const formData = await request.formData();
  const id = formData.get("id")?.toString() ?? "";
  return { id };
};

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: `User POC Delete #${params.id}` },
//   {
//     content: `User POC Delete #${params.id} | description`,
//     name: "description",
//   },
// ];

export default ({ params }: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  // const { errors } = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div>
      <fetcher.Form method="post">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend className="fieldset-legend">
            User POC #{params.id} Delete
          </legend>
          <p>Are you sure want to delete User POC #{params.id}?</p>
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
      {/* {actionData ? <p>#{actionData.id} updated</p> : null} */}
    </div>
  );
};

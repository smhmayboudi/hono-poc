import type { AppType } from "backend";
import { hc } from "hono/client";
import { href, useFetcher, useNavigate } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Button from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc.$id.delete";

// export const action = async ({ params }: Route.ActionArgs) => {
//   console.log("SERVER - action");
//   const client = hc<AppType>("http://127.0.0.1:8081/");
//   const res = await client.api.v1["user-poc"][":id"].$delete({ param: params });
//   if (res.ok) {
//     const { data } = await res.json();
//
//     return { data };
//   }
//   const { errors } = await res.json();
//
//   return { errors };
// };

export const clientAction = async ({ params }: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  await sleep(1000);
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc"][":id"].$delete({ param: params });
  if (res.ok) {
    const { data } = await res.json();

    return { data };
  }
  const { errors } = await res.json();

  return { errors };
};

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: `User POC Delete #${params.id}` },
//   {
//     content: `User POC Delete #${params.id} | description`,
//     name: "description",
//   },
// ];

export default ({ params }: Route.ComponentProps) => {
  const fetcher = useFetcher<typeof clientAction>();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();

  return (
    <div>
      <fetcher.Form method="post">
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">
            User POC #{params.id} Delete
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
          <div className="join">
            <Button
              c_behavior="active"
              c_color="primary"
              c_size="sm"
              className="join-item"
              disabled={busy}
              type="submit"
            >
              {busy ? <Loading c_size="xs" /> : "OK"}
            </Button>
            <Button
              c_size="sm"
              className="join-item"
              onClick={() => {
                navigate(href("/dashboard/user-poc/read"));
              }}
              type="button"
            >
              CANCEL
            </Button>
          </div>
        </fieldset>
      </fetcher.Form>
      {fetcher.data?.data?.id ? <p>#{fetcher.data.data.id} delete.</p> : <></>}
      {fetcher.data?.errors ? (
        <>
          {fetcher.data.errors.map((values) => (
            <p>
              {values.title}[{values.code}]: {values.detail}
            </p>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

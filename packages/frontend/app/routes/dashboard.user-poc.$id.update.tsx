import { AppType } from "backend";
import { hc } from "hono/client";
import { href, useFetcher, useNavigate } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Button from "~/components/ui/button";
import { FormBlocker, useFormBlocker } from "~/components/ui/form-blocker";
import Loading from "~/components/ui/loading";

import type { Route } from "./+types/dashboard.user-poc.$id.update";

// export const action = async ({ params, request }: Route.ActionArgs) => {
//   console.log("SERVER - action");
//   const formData = await request.formData();
//   const fullname = formData.get("fullname") as string;
//   const client = hc<AppType>("http://127.0.0.1:8081/");
//   const res = await client.api.v1["user-poc"][":id"].$patch({
//     json: { fullname },
//     param: params,
//   });
//   if (res.ok) {
//     const { data } = await res.json();
//     return { data };
//   }
//   const { errors } = await res.json();
//   return { errors };
// };

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = await request.formData();
  const fullname = formData.get("fullname") as string;
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc"][":id"].$patch({
    json: { fullname },
    param: params,
  });
  if (res.ok) {
    const { data } = await res.json();
    return { data };
  }
  const { errors } = await res.json();
  return { errors };
};

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  console.log("CLIENT - clientLoader");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc"][":id"].$get({ param: params });
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
//   const res = await client.api.v1["user-poc"][":id"].$get({ param: params });
//   if (res.ok) {
//     const { data } = await res.json();
//     return { data };
//   }
//   const { errors } = await res.json();
//   return { errors };
// };

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: `User POC Update #${params.id}` },
//   {
//     content: `User POC Update #${params.id} | description`,
//     name: "description",
//   },
// ];

export default ({ loaderData, params }: Route.ComponentProps) => {
  const fetcher = useFetcher<typeof clientAction>();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();

  const { blocker, formRef, setIsDirty } = useFormBlocker(fetcher);

  return (
    <div>
      <fetcher.Form
        method="post"
        onChange={(event) => {
          const fullname = event.currentTarget.fullname.value;
          setIsDirty(Boolean(fullname));
        }}
        ref={formRef}
      >
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">
            User POC #{params.id} Update
          </legend>
          <label className="floating-label">
            <span>Name</span>
            <input
              aria-label="Fullname"
              className="input validator"
              defaultValue={loaderData.data?.attributes?.fullname}
              name="fullname"
              placeholder="Fullname"
              required
              type="text"
            />
            <div className="validator-hint">Please fill out this field.</div>
            {/* {errors?.name && <div>{errors.name}</div>} */}
          </label>
          <input type="hidden" name="id" defaultValue={params.id} />
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
      <FormBlocker blocker={blocker} />
      {fetcher?.data?.data?.id ? (
        <p>#{fetcher.data.data.id} updated.</p>
      ) : (
        <></>
      )}
      {fetcher?.data?.errors ? (
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

import type { AppType } from "backend";
import { hc } from "hono/client";
import { href, useFetcher, useNavigate } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Button from "~/components/ui/button";
import { FormBlocker, useFormBlocker } from "~/components/ui/form-blocker";
import Loading from "~/components/ui/loading";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc-view.$id.update";

// export const action = async ({ params, request }: Route.ActionArgs) => {
//   console.log("SERVER - action");
//   const formData = await request.formData();
//   const address = formData.get("address") as string;
//   const age = Number(formData.get("age") as string);
//   const fullname = formData.get("fullname") as string;
//   const client = hc<AppType>("http://127.0.0.1:8081/");
//   const res = await client.api.v1["user-poc-view"][":id"].$patch({
//     json: { address, age, fullname },
//     param: params,
//   });
//   if (res.ok) {
//     const { data } = await res.json();
//
//     return { data };
//   }
//   const { errors } = await res.json();
//
//   return { errors };
// };

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  await sleep(1000);
  const formData = await request.formData();
  const address = formData.get("address") as string;
  const age = Number(formData.get("age") as string);
  const fullname = formData.get("fullname") as string;
  const client = hc<AppType>("http://127.0.0.1:8081/");
  const res = await client.api.v1["user-poc-view"][":id"].$patch({
    json: { address, age, fullname },
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
//   { title: `User POC View Update #${params.id}` },
//   {
//     content: `User POC View Update #${params.id} | description`,
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
          const fullname = event.currentTarget["fullname"].value;
          setIsDirty(Boolean(fullname));
        }}
        ref={formRef}
      >
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">
            User POC View #{params.id} Update
          </legend>
          <label className="floating-label input validator">
            <span>Address</span>
            <input
              aria-label="Address"
              defaultValue={loaderData.data?.attributes?.address}
              name="address"
              placeholder="Address"
              required
              type="text"
            />
            <p className="validator-hint">Please fill out this field.</p>
            {/* {errors?.address && <div>{errors.address}</div>} */}
          </label>
          <label className="floating-label input validator">
            <span>Age</span>
            <input
              aria-label="Age"
              defaultValue={loaderData.data?.attributes?.age}
              name="age"
              placeholder="Age"
              required
              type="number"
            />
            <p className="validator-hint">Please fill out this field.</p>
            {/* {errors?.age && <div>{errors.age}</div>} */}
          </label>
          <label className="floating-label input validator">
            <span>Fullname</span>
            <input
              aria-label="Fullname"
              defaultValue={loaderData.data?.attributes?.fullname}
              name="fullname"
              placeholder="Fullname"
              required
              type="text"
            />
            <p className="validator-hint">Please fill out this field.</p>
            {/* {errors?.fullname && <div>{errors.fullname}</div>} */}
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
                navigate(href("/dashboard/user-poc-view/read"));
              }}
              type="button"
            >
              CANCEL
            </Button>
          </div>
        </fieldset>
      </fetcher.Form>
      <FormBlocker blocker={blocker} />
      {fetcher.data?.data?.id ? <p>#{fetcher.data.data.id} updated.</p> : <></>}
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

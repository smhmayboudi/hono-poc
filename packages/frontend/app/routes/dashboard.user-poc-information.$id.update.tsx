import type { AppType } from "backend";
import { hc } from "hono/client";
import { href, useFetcher, useNavigate } from "react-router";

import errorBoundary from "~/components/error-boundary";
import hydrateFallback from "~/components/hydrate-fallback";
import Button from "~/components/ui/button";
import { FormBlocker, useFormBlocker } from "~/components/ui/form-blocker";
import Loading from "~/components/ui/loading";
import { sleep } from "~/utils/time";

import type { Route } from "./+types/dashboard.user-poc-information.$id.update";

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  console.log("CLIENT - clientAction");
  await sleep(1000);
  const formData = await request.formData();
  const address = formData.get("address") as string;
  const age = Number(formData.get("age") as string);
  const userId = formData.get("userId") as string;
  const client = hc<AppType>(window.env.APP_BASE_URL, {
    headers: { authorization: `Bearer ${window.session?.token ?? ""}` },
  });
  const res = await client.api.v1["user-poc-information"][":id"].$patch({
    json: { address, age, userId },
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
  const client = hc<AppType>(window.env.APP_BASE_URL, {
    headers: { authorization: `Bearer ${window.session?.token ?? ""}` },
  });
  const res = await client.api.v1["user-poc-information"][":id"].$get({
    param: params,
  });
  if (res.ok) {
    const { data } = await res.json();

    return { data };
  }
  const { errors } = await res.json();

  return { errors };
};

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: `User POC Information Update #${params.id}` },
//   {
//     content: `User POC Information Update #${params.id} | description`,
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
          const address = event.currentTarget["address"].value;
          const age = event.currentTarget["age"].value;
          setIsDirty(Boolean(address || age));
        }}
        ref={formRef}
      >
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">
            User POC Information #{params.id} Update
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
            <span>UserID</span>
            <input
              aria-label="UserID"
              defaultValue={loaderData.data?.attributes?.userId}
              disabled
              name="userId"
              placeholder="UserID"
              required
              type="text"
            />
            <p className="validator-hint">Please fill out this field.</p>
            {/* {errors?.userId && <div>{errors.userId}</div>} */}
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
                navigate(href("/dashboard/user-poc-information/read"));
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
        fetcher.data.errors.map((values) => (
          <p key={values.code}>
            {values.title}[{values.code}]: {values.detail}
          </p>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export const ErrorBoundary = errorBoundary;

export const HydrateFallback = hydrateFallback;

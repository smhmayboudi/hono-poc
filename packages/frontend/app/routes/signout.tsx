import { href, redirect, useFetcher, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { destroySession, getSession } from "~/sessions.server";
import { authClient } from "~/utils/auth-client";

import type { Route } from "./+types/signout";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const session = await getSession(request.headers.get("Cookie"));
  await authClient.signOut();

  return redirect(href("/"), {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Signout" },
//   { content: "Signout | description", name: "description" },
// ];

export default () => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();

  return (
    <div>
      <fetcher.Form method="post">
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">Signout</legend>
          <p>Are you sure you want to signout?</p>
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
                navigate(href("/"));
              }}
              type="button"
            >
              CANCEL
            </Button>
          </div>
        </fieldset>
      </fetcher.Form>
    </div>
  );
};

import { data, href, redirect, useFetcher, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { commitSession, destroySession, getSession } from "~/sessions.server";
import { authClient } from "~/utils/auth-client";

import type { Route } from "./+types/signout";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const session = await getSession(request.headers.get("Cookie"));
  try {
    await authClient.signOut();

    return redirect(href("/"), {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  } catch (error) {
    session.flash("error", String(error));

    return redirect(href("/signout"), {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  console.log("SERVER - loader");
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token") && !session.has("user")) {
    return redirect(href("/signin"));
  }

  return data(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Signout" },
//   { content: "Signout | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();
  // const auth = useAuth();
  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   auth.signOut(() => {
  //     navigate(href("/"));
  //   });
  // };

  return (
    <div>
      {loaderData.error ? (
        <div>
          <p>{loaderData.error}</p>
        </div>
      ) : null}
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

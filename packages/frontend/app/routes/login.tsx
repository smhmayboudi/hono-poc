import { data, href, redirect, useFetcher, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import Loading from "~/components/ui/loading";
import { commitSession, getSession } from "~/sessions.server";

import type { Route } from "./+types/login";

const validateCredentials = (username: string, password: string) => {
  console.log({ username, password });

  return Promise.resolve("1234567890");
};

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  const userId = await validateCredentials(username, password);

  if (userId === null) {
    session.flash("error", "Invalid username/password");

    return redirect(href("/login"), {
      headers: {
        "Set-Cookie": await commitSession(session, {
          expires: new Date(Date.now() + 60_000),
        }),
      },
    });
  }
  session.set("userId", userId);

  return redirect(href("/"), {
    headers: {
      "Set-Cookie": await commitSession(session, {
        expires: new Date(Date.now() + 60_000),
      }),
    },
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  console.log("SERVER - loader");
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect(href("/"));
  }

  return data(
    { error: session.get("error") },
    {
      headers: {
        "Set-Cookie": await commitSession(session, {
          expires: new Date(Date.now() + 60_000),
        }),
      },
    },
  );
};

export default ({ loaderData }: Route.ComponentProps) => {
  const { error } = loaderData;
  const fetcher = useFetcher<typeof loader>();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <fetcher.Form method="post">
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">Login</legend>
          <label className="floating-label input validator">
            <Icon c_name="outline-username" className="h-[1em] opacity-50" />
            <input
              aria-label="Username"
              name="username"
              placeholder="Username"
              required
              type="text"
            />
          </label>
          <label className="floating-label input validator">
            <Icon c_name="outline-password" className="h-[1em] opacity-50" />
            <input
              aria-label="Password"
              name="password"
              placeholder="Password"
              required
              type="password"
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
